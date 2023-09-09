import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestEvent } from "@sveltejs/kit";


export async function exportUserAnimeList(event: RequestEvent, format: 'json' | 'csv') {
    const userId = event.locals.authenticatedUser?.user.id;

    if (userId == null) {
        throw error(401);
    }

    switch (format) {
        case 'json': {
            const json = await UserAnimeListService.getUserListAsJSON(userId);
            if (json == null) {
                throw error(404);
            }

            return new Response(json, {
                headers: {
                    'content-type': 'text/json; charset=utf-8'
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
                    'content-type': 'text/csv; charset=utf-8'
                }
            })
        }
        default:
            throw error(429)
    }

}