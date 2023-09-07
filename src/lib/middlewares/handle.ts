import { dev } from "$app/environment";
import { combineMiddlewares, type Middleware } from ".";
import { initializeKv } from "../kv";
import { MALClient } from "../myanimelist/api";
import { getServerSession } from "../myanimelist/svelte/auth";
import { createMyAnimeListHandler } from "../myanimelist/svelte/handle";

function miniflareMiddleware(): Middleware {
    return async (event, next) => {
        if (dev) {
            const { fallBackPlatformToMiniFlareInDev } = await import('$lib/miniflare');
            event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        initializeKv(event.platform?.env.KV_STORE!);
        const res = await next(event);
        return res;
    }
}

function myAnimeListMiddleware(): Middleware {
    return (event, next) => {
        const myAnimeListHandler = createMyAnimeListHandler();
        const pathname = event.url.pathname;

        if (pathname.startsWith("/api/myanimelist")) {
            return myAnimeListHandler(event);
        }

        return next(event);
    }
}

function authMiddleware(): Middleware {
    return async (event, next) => {
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

        return next(event);
    }
}

function loggerMiddleware(): Middleware {
    return async (event, next) => {
        const startMs = Date.now();
        const response = await next(event);
        const elapsedMs = Date.now() - startMs;

        const icon = response.ok ? "✅" : "❌";
        const request = event.request;
        const method = request.method;
        const status = response.status;
        const url = request.url;
        const now = new Date().toISOString();
        // ❌ 2023-09-01T23:13:48.386Z - GET 200 [230ms] /api/users/ 
        console.log(`${icon} ${now} - ${method} ${status} [${elapsedMs}ms] ${url}`);

        return response;
    }
}

export function createMiddlewareHandler() {
    const handle = combineMiddlewares([
        loggerMiddleware(),
        miniflareMiddleware(),
        authMiddleware(),
        myAnimeListMiddleware()
    ]);
    return handle;
}