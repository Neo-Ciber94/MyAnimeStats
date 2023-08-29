import { MALClient } from "@/lib/myanimelist/api";
import type { RequestHandler } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import { parseNumberOrNull } from "@/lib/utils/helpers";

const LIMIT = 100;

export const GET: RequestHandler = async ({ request, setHeaders }) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const offset = parseNumberOrNull(searchParams.get('offset')) ?? 0;
    const allowNsfw = searchParams.get('nsfw') === 'true';

    const cacheHeaders = {
        'cache-control': 'max-age=3600, stale-while-revalidate=600'
    };

    const { animeList, next } = await getAnimeByQuery({ q, offset, allowNsfw });

    // Cache results for 1 hour
    setHeaders({ ...cacheHeaders })
    return Response.json({ data: animeList, next });
}

type AnimeQuery = {
    q: string,
    offset: number,
    allowNsfw?: boolean,
}

async function getAnimeByQuery(query: AnimeQuery) {
    const { q, offset, allowNsfw = false } = query;

    if (q.trim().length === 0) {
        return { animeList: [], next: null }
    }

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
        if (allowNsfw) {
            return true;
        }

        return !node.genres?.some(x => x.id === ANIME_GENRES.Hentai.ID)
    });

    let next: string | null = null;

    // While we had anime we assume there is more
    if (animeList.length > 0) {
        const nextOffset = LIMIT + offset;
        next = `/api/anime?offset=${nextOffset}`;
    }

    return { animeList, next }
}