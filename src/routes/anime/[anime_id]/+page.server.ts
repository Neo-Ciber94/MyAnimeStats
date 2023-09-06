import { MALClient } from "@/lib/myanimelist/api";
import type { PageServerLoad } from "./$types";
import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { Retry, runAndRetryOnThrow } from "@/lib/utils/retry";
import { AnimeListService } from "@/lib/services/animeListService";

export const load: PageServerLoad = async (event) => {
    const malClient = new MALClient({
        clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID,
        accessToken: event.locals.authenticatedUser?.accessToken
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

    const popularAnimeList = await AnimeListService.getPopularAnimeList({ force: false })
        .then(animeList => animeList.sort((a, b) => a.ranking.rank - b.ranking.rank))
        .then(animeList => animeList.slice(0, 10));

    return {
        anime,
        popularAnimeList
    }
};