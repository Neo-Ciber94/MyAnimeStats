import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID,
        accessToken: event.locals.authenticatedUser?.accessToken
    });

    const animeId = Number(event.params.anime_id);
    const result = await malClient.getAnimeDetails(animeId, {
        fields: [
            'statistics',
            'synopsis',
            'genres',
            'rank',
            'mean',
            'num_list_users',
            'num_scoring_users',
            'popularity',
            'start_season',
            'start_date',
            'end_date',
            'media_type',
            'status',
            'alternative_titles',
            'average_episode_duration',
            'pictures',
            'source',
            'rating',
            'studios'
        ]
    });

    if (result == null) {
        throw error(404, "Anime not found");
    }

    return result
};