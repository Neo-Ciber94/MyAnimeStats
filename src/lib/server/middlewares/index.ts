import { dev } from "$app/environment";
import { initializeKv } from "$lib/server/kv";
import { MALClient } from "$lib/myanimelist/api";
import { getServerSession } from "$lib/myanimelist/svelte/auth";
import { createMyAnimeListHandler } from "$lib/myanimelist/svelte/handle";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

function miniflareMiddleware(): Handle {
    return async ({ event, resolve }) => {
        if (dev) {
            const { fallBackPlatformToMiniFlareInDev } = await import('@/lib/server/miniflare');
            event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        initializeKv(event.platform?.env.KV_STORE!);
        const res = await resolve(event);
        return res;
    }
}

function myAnimeListMiddleware(): Handle {
    return ({ event, resolve }) => {
        const myAnimeListHandler = createMyAnimeListHandler();
        const pathname = event.url.pathname;

        if (pathname.startsWith("/api/myanimelist") && !event.isDataRequest) {
            return myAnimeListHandler({ event, resolve });
        }

        return resolve(event);
    }
}

function authMiddleware(): Handle {
    return async ({ event, resolve }) => {
        const session = await getServerSession(event.cookies);

        if (session) {
            try {
                const { accessToken } = session;
                const malClient = new MALClient({ accessToken });
                const user = await malClient.getMyUserInfo({ fields: ['anime_statistics'] });
                event.locals.session = { user, accessToken };
            }
            catch (err) {
                console.error(err);
            }
        } else {
            event.locals.session = undefined;
        }

        return resolve(event);
    }
}

function loggerMiddleware(): Handle {
    return async ({ event, resolve }) => {
        const startMs = Date.now();
        const response = await resolve(event);
        const elapsedMs = Date.now() - startMs;

        const request = event.request;
        const method = request.method;
        const status = response.status;
        const url = request.url;
        const now = new Date().toISOString();
        const icon = status >= 400 ? "❌" : status >= 300 ? "🔁" : "✅";

        // ❌ 2023-09-01T23:13:48.386Z - GET 200 [230ms] /api/users/ 
        console.log(`${icon} ${now} - ${method} ${status} [${elapsedMs}ms] ${url}`);

        return response;
    }
}

export function createMiddlewareHandler() {
    return sequence(
        loggerMiddleware(),
        miniflareMiddleware(),
        authMiddleware(),
        myAnimeListMiddleware()
    )
}