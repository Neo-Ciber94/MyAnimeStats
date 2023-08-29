import { MALClient } from "@/lib/myanimelist/api";
import type { RequestHandler } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { getCurrentAnimeSeason, type AiringStatus, type AnimeSeason, animeSeasonSchema } from "@/lib/myanimelist/common/types";
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

    const cacheHeaders = {
        'cache-control': 'max-age=3600, stale-while-revalidate=600'
    };

    // If there is not search params we just return the seasonal anime
    if (q.length === 0) {
        const year = parseNumberOrNull(searchParams.get('year')) ?? undefined;
        const season = animeSeasonSchema
            .optional()
            .catch(undefined)
            .parse(searchParams.get('season'));

        const { animeList, next } = await getSeasonalAnime({ offset, allowNsfw, season, year });

        // Cache results for 1 hour
        setHeaders({ ...cacheHeaders })
        return Response.json({ data: animeList, next });
    }

    const { animeList, next } = await getAnimeByQuery({ q, offset, allowNsfw });

    // Cache results for 1 hour
    setHeaders({ ...cacheHeaders })
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

    let next: string | null = null;

    // While we had anime we assume there is more
    if (animeList.length > 0) {
        const nextOffset = LIMIT + offset;
        next = `/api/anime?offset=${nextOffset}`;
    }

    return { animeList, next }
}

type SeasonalAnimeQuery = {
    offset: number,
    season?: AnimeSeason,
    year?: number,
    allowNsfw?: boolean;
}

async function getSeasonalAnime(query: SeasonalAnimeQuery) {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    })

    const currentSeason = getCurrentAnimeSeason();
    const { offset, allowNsfw, season = currentSeason.season, year = currentSeason.year } = query;
    const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];

    const result = await malClient.getSeasonalAnime({
        season,
        year,
        limit: LIMIT,
        offset,
        sort: 'anime_num_list_users',
        fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
        nsfw: true
    });

    const animeList = result.data.filter(({ node }) => {
        if (!node.start_season) {
            return false;
        }

        const isNsfw = node.genres?.some(x => x.id === ANIME_GENRES.Hentai.ID);

        return node.start_season.season === season
            && node.start_season.year === year
            && node.broadcast?.start_time != null
            && AVAILABLE_STATUSES.includes(node.status)
            && (allowNsfw || !isNsfw)
    });

    let next: string | null = null;

    // While we had anime we assume there is more
    if (animeList.length > 0) {
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
