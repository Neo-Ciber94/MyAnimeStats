import { COOKIE_MY_LIST_TIMESTAMP } from "@/common/constants";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestEvent } from "@sveltejs/kit";

function getCacheKey(timestamp: string | undefined, format: 'json' | 'csv') {
    const base64 = btoa(`${timestamp}-${format}`);
    return base64;
}

export async function exportUserAnimeList(event: RequestEvent, format: 'json' | 'csv') {
    const userId = event.locals.authenticatedUser?.user.id;

    if (userId == null) {
        throw error(401);
    }

    const timestamp = event.cookies.get(COOKIE_MY_LIST_TIMESTAMP);
    let cacheKey = getCacheKey(timestamp, format);

    if (cacheKey && event.request.headers.get('if-none-match') === cacheKey) {
        return new Response(undefined, { status: 304 });
    }

    // We set a new cache-key
    if (cacheKey == null) {
        const timestamp = String(Date.now());
        cacheKey = getCacheKey(timestamp, format);
        event.cookies.set(COOKIE_MY_LIST_TIMESTAMP, timestamp);
    }

    const cacheControl: Record<string, string> = {
        'cache-control': 'max-age=3600',
        'etag': cacheKey
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