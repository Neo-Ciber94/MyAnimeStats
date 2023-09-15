import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { Retry, runAndRetryOnThrow } from "@/lib/utils/retry";
import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";

export const load: PageServerLoad = async (event) => {
    const malClient = new MALClient({
        clientId: MY_ANIME_LIST_CLIENT_ID,
        accessToken: event.locals.session?.accessToken
    });

    const animeId = Number(event.params.anime_id);
    const getAnime = () => malClient.getAnimeDetails(animeId, {
        fields: [
            'statistics',
            'synopsis',
            'genres',
            'rank',
            'mean',
            'num_list_users',
            'num_scoring_users',
            'num_episodes',
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
            'studios',
            'nsfw',
            'related_anime',
            'related_manga',
            'recommendations',
            'my_list_status',
            'related_anime{genres}'
        ]
    });

    const anime = await runAndRetryOnThrow(getAnime, Retry.exponential({ attends: 10 }));

    if (anime == null) {
        throw error(404, "Anime not found");
    }

    return {
        anime
    }
};