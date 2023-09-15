import { env } from "$env/dynamic/public";

/**
 * Returns the path of the `MyAnimeList` api.
 * 
 * It returns `PUBLIC_MY_ANIME_LIST_API` if available.
 */
export function getApiUrl() {
    if (env.PUBLIC_MY_ANIME_LIST_API) {
        return env.PUBLIC_MY_ANIME_LIST_API;
    }

    return "/api/myanimelist";
}