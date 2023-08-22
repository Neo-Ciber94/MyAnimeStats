import { MyAnimeListHandler } from "$lib/myanimelist/svelte/handle";
import type { Handle } from "@sveltejs/kit";
import { getServerSession } from "./lib/myanimelist/svelte/auth";
import { MALClient } from "./lib/myanimelist/api";

const myAnimeListHandler = MyAnimeListHandler();

export const handle = (async ({ event, resolve }) => {
    const session = await getServerSession(event.cookies);

    if (session) {
        try {
            const { accessToken } = session;
            const malClient = new MALClient({ accessToken });
            const user = await malClient.getMyUserInfo({ fields: ['anime_statistics'] });
            event.locals.authenticatedUser = { user, accessToken };
        }
        catch (err) {
            console.error(err);
        }
    }

    const pathname = event.url.pathname;

    if (pathname.startsWith("/api/myanimelist")) {
        return myAnimeListHandler(event);
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle;