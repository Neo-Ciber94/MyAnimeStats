import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    const userId = locals.authenticatedUser?.user.id;

    if (userId == null) {
        throw error(401);
    }

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