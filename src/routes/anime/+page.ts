import { getCurrentAnimeSeason } from "$lib/myanimelist/common/types";
import type { PageLoad } from "./$types";
import { MALClient } from "$lib/myanimelist/api";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";

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
        limit: 50,
        sort: 'anime_num_list_users',
        fields: ["nsfw", "genres", "status", "mean"]
    });

    return result;
};