import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import type { AiringStatus } from "@/lib/myanimelist/common/types";
import { invariant } from "@/lib/utils/invariant";
import ANIME_GENRES from "@/generated/animeGenres";
import { shuffleArray } from "@/lib/utils/helpers";
import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";
import { AnimeHelper } from "@/lib/myanimelist/common/helper";

const ANIME_LIMIT = 50;

export const load: PageServerLoad = async (event) => {
    const accessToken = event.locals.session?.accessToken;

    const suggestedAnimeList = await getSuggestedAnimeList({ limit: ANIME_LIMIT, accessToken });
    const seasonalAnimeList = await getCurrentSeasonAnimeList({ limit: ANIME_LIMIT });
    const mostPopularAnimeList = await getMostPopularAnimeList({ limit: ANIME_LIMIT });
    const upcomingAnimeList = await getUpcomingAnimeList({ limit: 100 });

    return { seasonalAnimeList, suggestedAnimeList, mostPopularAnimeList, upcomingAnimeList }
};

async function getCurrentSeasonAnimeList({ limit }: { limit: number }) {
    const malClient = new MALClient({
        clientId: MY_ANIME_LIST_CLIENT_ID
    });

    const { season, year } = AnimeHelper.getCurrentAnimeSeason();
    const result = await malClient.getSeasonalAnime({
        season,
        year,
        limit,
        fields: ['start_season', 'status', 'start_date', 'genres', 'broadcast'],
        sort: 'anime_num_list_users',
        nsfw: true
    });

    const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];

    const animeList = result.data.filter(({ node }) => {
        invariant(node.start_season, "start season not defined");

        return node.start_season.season == season
            && node.start_date != null
            && AVAILABLE_STATUSES.includes(node.status)
            && node.broadcast?.start_time != null
            && !node.genres.some(x => x.id === ANIME_GENRES.Hentai.ID)
    });

    return animeList;
}

async function getSuggestedAnimeList({ limit, accessToken }: { limit: number, accessToken?: string }) {
    if (accessToken == null) {
        return null;
    }

    const malClient = new MALClient({ accessToken });
    const suggestions = await malClient.getSuggestedAnime({
        limit,
        fields: ['start_date', 'rank']
    });

    const data = shuffleArray(suggestions.data);
    return data;
}

async function getMostPopularAnimeList({ limit }: { limit: number }) {
    const malClient = new MALClient({ clientId: MY_ANIME_LIST_CLIENT_ID });

    const result = await malClient.getAnimeRanking({
        limit,
        ranking_type: 'tv',
    });

    const data = result.data;
    return data;
}

async function getUpcomingAnimeList({ limit }: { limit: number }) {
    const malClient = new MALClient({ clientId: MY_ANIME_LIST_CLIENT_ID });
    const currentSeason = AnimeHelper.getCurrentAnimeSeason();
    const { season, year } = AnimeHelper.getNextAnimeSeason(currentSeason.season, currentSeason.year);

    const result = await malClient.getSeasonalAnime({
        limit,
        season,
        year,
        fields: ['status', 'num_list_users', 'popularity']
    });

    const notYetAired = result.data.filter(anime => anime.node.status === 'not_yet_aired');
    const data = shuffleArray(notYetAired);
    return data;
}