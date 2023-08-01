import { type AnimeApiResponse, getCurrentAnimeSeason } from "$lib/myanimelist/common/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const { year, season } = getCurrentAnimeSeason();
    const limit = 50;
    const sort = "anime_num_list_users";
    const fields = "nsfw,genres,status,mean"
    const res = await fetch(`/api/myanimelist/anime/season/${year}/${season}?limit=${limit}&fields=${fields}&sort=${sort}`);

    if (!res.ok) {
        let msg: string;
        if (res.headers.get('content-type') === 'application/json') {
            msg = await res.text();
        } else {
            msg = `${res.status} - ${res.statusText}`;
        }

        throw error(res.status, msg);
    }

    const result = await res.json() as AnimeApiResponse;
    return result;
};