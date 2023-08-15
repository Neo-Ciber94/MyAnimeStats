import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { getCurrentAnimeSeason, type AiringStatus } from "@/lib/myanimelist/common/types";
import { invariant } from "@/lib/utils/invariant";
import ANIME_GENRES from "@/types/generated/animeGenres.generated";

export const load: PageServerLoad = async () => {
    const seasonalAnimeList = await getCurrentSeasonAnimeList(100);
    return { seasonalAnimeList }
};

async function getCurrentSeasonAnimeList(limit: number) {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    });

    const { season, year } = getCurrentAnimeSeason();
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