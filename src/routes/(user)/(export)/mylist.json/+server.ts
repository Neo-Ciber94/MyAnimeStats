import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    const userId = locals.authenticatedUser?.user.id;

    if (userId == null) {
        throw error(401);
    }

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