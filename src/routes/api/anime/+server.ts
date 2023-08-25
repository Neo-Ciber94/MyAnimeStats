import { MALClient } from "@/lib/myanimelist/api";
import type { RequestHandler } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { getCurrentAnimeSeason, type AiringStatus, type AnimeSeason } from "@/lib/myanimelist/common/types";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import { error } from "@sveltejs/kit";

const LIMIT = 100;

export const GET: RequestHandler = async ({ request, setHeaders }) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const offset = parseNumberOrNull(searchParams.get('offset')) ?? 0;
    const allowNsfw = searchParams.get('nsfw') === 'true';

    if (q.length > 0 && q.length < 3) {
        throw error(400, 'Expected a search of 3 or more characters')
    }

    const cacheControl = 'max-age=3600, stale-while-revalidate=600';

    // If there is not search params we just return the seasonal anime
    if (q.length === 0) {
        const { animeList, next } = await getSeasonalAnime({ offset, allowNsfw });

        // Cache results for 1 hour
        setHeaders({ 'Cache-Control': cacheControl })
        return Response.json({ data: animeList, next });
    }

    const { animeList, next } = await getAnimeByQuery({ q, offset, allowNsfw });

    // Cache results for 1 hour
    setHeaders({ 'Cache-Control': cacheControl })
    return Response.json({ data: animeList, next });
}

type AnimeQuery = {
    q: string,
    offset: number,
    season?: AnimeSeason,
    year?: number,
    allowNsfw?: boolean,
}

async function getAnimeByQuery(query: AnimeQuery) {
    const { q, offset, allowNsfw = false } = query;

    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    })

    const result = await malClient.getAnimeList({
        // sort? https://myanimelist.net/forum/?topicid=1936588
        q,
        limit: LIMIT,
        offset,
        fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
        nsfw: true
    })

    const animeList = result.data.filter(({ node }) => {
        return !allowNsfw && !node.genres?.some(x => x.id === ANIME_GENRES.Hentai.ID)
    });

    return { animeList, next: null }
}

async function getSeasonalAnime({ offset, allowNsfw }: { offset: number, allowNsfw?: boolean }) {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    })

    const { season, year } = getCurrentAnimeSeason();
    const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];

    const result = await malClient.getSeasonalAnime({
        season,
        year,
        limit: LIMIT + 1,
        offset,
        sort: 'anime_num_list_users',
        fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
        nsfw: true
    });

    const animeList = result.data.filter(({ node }) => {
        if (!node.start_season) {
            return false;
        }

        const isNsfw = node.genres.some(x => x.id === ANIME_GENRES.Hentai.ID);

        return node.start_season.season === season
            && node.start_season.year === year
            && node.broadcast?.start_time != null
            && AVAILABLE_STATUSES.includes(node.status)
            && (allowNsfw || !isNsfw)
    });

    let next: string | null = null;

    // If we fetched the additional element means we can fetch more
    if (animeList.length >= (LIMIT + 1)) {
        animeList.pop(); // remove?
        const nextOffset = LIMIT + offset;
        next = `/api/anime?offset=${nextOffset}`;
    }

    return { animeList, next }
}

function parseNumberOrNull(s: string | null): number | null {
    if (s == null) {
        return null;
    }

    const value = Number(s);
    return Number.isNaN(value) ? null : value;
}