import type { RequestHandler } from "./$types";
import { type AnimeSeason, animeSeasonSchema } from "@/lib/myanimelist/common/types";
import { parseNumberOrNull } from "@/lib/utils/helpers";
import { AnimeHelper } from "@/lib/myanimelist/common/helper";
import { AnimeListService } from "@/lib/server/services/animeListService";
import { AnimeSeasonYear } from "@/lib/myanimelist/common/AnimeSeasonYear";
import { error, json } from "@sveltejs/kit";

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
    return json({ data: animeList, next });
}

type SeasonalAnimeQuery = {
    offset: number,
    season?: AnimeSeason,
    year?: number,
    allowNsfw?: boolean;
}

export async function _getSeasonalAnime(query: SeasonalAnimeQuery) {
    const currentSeason = AnimeHelper.getCurrentAnimeSeason();
    const { offset, allowNsfw, season = currentSeason.season, year = currentSeason.year } = query;

    const minSeason = AnimeSeasonYear.from('winter', 1900);
    const maxSeason = AnimeSeasonYear.from(currentSeason.season, currentSeason.year).next;
    const cur = AnimeSeasonYear.from(season, year);

    if (cur.compare(minSeason) < 0 || cur.compare(maxSeason) > 0) {
        throw error(400, 'Season out of range');
    }

    const result = await AnimeListService.getSeasonAnime({
        season,
        year,
        offset,
        limit: LIMIT,
        nsfw: allowNsfw
    });

    const animeList = result.filter(({ node }) => {
        if (!node.start_season) {
            return false;
        }

        return node.start_season.season === season
            && node.start_season.year === year
            && node.broadcast?.start_time != null;
    });

    let next: string | null = null;

    // While we had anime we assume there is more
    if (animeList.length > 0) {
        const nextOffset = LIMIT + offset;
        next = `/api/anime?offset=${nextOffset}`;
    }

    return { animeList, next }
}