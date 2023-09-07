import { MALClient } from "@/lib/myanimelist/api";
import type { RequestHandler } from "./$types";
import { getCurrentAnimeSeason, type AiringStatus, type AnimeSeason, animeSeasonSchema } from "@/lib/myanimelist/common/types";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";
import { parseNumberOrNull } from "@/lib/utils/helpers";
import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";

const LIMIT = 100;

export const GET: RequestHandler = async ({ request, setHeaders }) => {
    const { searchParams } = new URL(request.url);
    const offset = parseNumberOrNull(searchParams.get('offset')) ?? 0;
    const allowNsfw = searchParams.get('nsfw') === 'true';

    const cacheHeaders = {
        'cache-control': 'max-age=3600, stale-while-revalidate=600'
    };

    const year = parseNumberOrNull(searchParams.get('year')) ?? undefined;
    const season = animeSeasonSchema
        .optional()
        .catch(undefined)
        .parse(searchParams.get('season'));

    const { animeList, next } = await _getSeasonalAnime({ offset, allowNsfw, season, year });

    // Cache results for 1 hour
    setHeaders({ ...cacheHeaders })
    return Response.json({ data: animeList, next });
}


type SeasonalAnimeQuery = {
    offset: number,
    season?: AnimeSeason,
    year?: number,
    allowNsfw?: boolean;
}

export async function _getSeasonalAnime(query: SeasonalAnimeQuery) {
    const malClient = new MALClient({
        clientId: MY_ANIME_LIST_CLIENT_ID
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