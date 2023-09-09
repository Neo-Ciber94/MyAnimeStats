import { COOKIE_MY_LIST_CACHE_KEY } from "@/common/constants";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestEvent } from "@sveltejs/kit";


export async function exportUserAnimeList(event: RequestEvent, format: 'json' | 'csv') {
    const userId = event.locals.authenticatedUser?.user.id;

    if (userId == null) {
        throw error(401);
    }

    let cacheKey = event.cookies.get(COOKIE_MY_LIST_CACHE_KEY);

    if (cacheKey && event.request.headers.get('if-none-match') === cacheKey) {
        return new Response(undefined, { status: 304 });
    }

    const cacheControl: Record<string, string> = {
        'cache-control': 'max-age=3600',
    }

    // We set a new cache-key
    if (cacheKey == null) {
        cacheKey = String(Date.now());
        cacheControl.etag = cacheKey;
        event.cookies.set(COOKIE_MY_LIST_CACHE_KEY, cacheKey);
    }

    switch (format) {
        case 'json': {
            const json = await UserAnimeListService.getUserListAsJSON(userId);
            if (json == null) {
                throw error(404);
            }

            return new Response(json, {
                headers: {
                    'content-type': 'text/json; charset=utf-8',
                    ...cacheControl
                }
            })
        }
        case 'csv': {
            const csv = await UserAnimeListService.getUserListAsCSV(userId);
            if (csv == null) {
                throw error(404);
            }

            return new Response(csv, {
                headers: {
                    'content-type': 'text/csv; charset=utf-8',
                    ...cacheControl
                }
            })
        }
        default:
            throw error(429)
    }

}