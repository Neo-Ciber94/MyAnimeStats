import { MyAnimeListHandler } from "$lib/myanimelist/svelte/handle";
import type { Handle } from "@sveltejs/kit";

const myAnimeListHandler = MyAnimeListHandler();

export const handle = (async ({ event, resolve }) => {
    const pathname = event.url.pathname;

    if (pathname.startsWith("/api/myanimelist")) {
        return myAnimeListHandler(event);
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle;