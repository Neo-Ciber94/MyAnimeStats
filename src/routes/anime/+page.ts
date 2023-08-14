import { getCurrentAnimeSeason, type AiringStatus } from "$lib/myanimelist/common/types";
import type { PageLoad } from "./$types";
import { MALClient } from "$lib/myanimelist/api";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { invariant } from "@/lib/utils/invariant";

export const load: PageLoad = async ({ fetch }) => {
    const { year, season } = getCurrentAnimeSeason();
    const malClient = new MALClient({
        fetch,
        proxyUrl: "/api/myanimelist",
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID
    });

    const result = await malClient.getSeasonalAnime({
        season,
        year,
        limit: 500,
        sort: 'anime_num_list_users',
        fields: ["nsfw", "genres", "status", "mean", 'start_season', 'broadcast'],
        nsfw: true
    });

    const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];
    const animeList = result.data.filter(({ node }) => {
        invariant(node.start_season, "start season is not defined");

        return node.start_season.season === season
            && node.start_season.year === year
            && node.broadcast?.start_time != null
            && AVAILABLE_STATUSES.includes(node.status)
    });

    return { animeList }
};