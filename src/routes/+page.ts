import { getCurrentAnimeSeason } from "$lib/myanimelist/common/helpers";
import type { AnimeApiResponse } from "$lib/myanimelist/common/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const { year, season } = getCurrentAnimeSeason();
    const res = await fetch(`/api/myanimelist/anime/season/${year}/${season}?limit=100`);

    if (!res.ok) {
        let msg: string;
        if (res.headers.get('content-type') === 'application/json') {
            msg = await res.text();
        } else {
            msg = `${res.status} - ${res.statusText}`;
        }

        throw new Error(msg);
    }

    const result = await res.json() as AnimeApiResponse;
    return result;
};