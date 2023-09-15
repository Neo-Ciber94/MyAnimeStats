/**
 * Returns the path of the `MyAnimeList` api.
 */
export function getApiUrl() {
    if (process.env.MY_ANIME_LIST_API) {
        return process.env.MY_ANIME_LIST_API;
    }

    return "/api/myanimelist";
}