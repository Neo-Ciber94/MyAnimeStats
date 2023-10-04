import { MALClient } from "@animelist/client";
import { watchStatusSchema } from "@/lib/myanimelist/common/types";
import { getRequiredServerSession } from "@animelist/auth-sveltekit/server";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, type RequestHandler } from "@sveltejs/kit";
import { z } from 'zod';

const updateMyAnimeListStatusSchema = z.object({
    score: z.string().pipe(z.coerce.number().min(0).max(10)),
    status: watchStatusSchema,
    num_watched_episodes: z.string().pipe(z.coerce.number().min(0)),
})

export const PATCH: RequestHandler = async ({ request, params, cookies, locals }) => {
    const { userId, accessToken } = await getRequiredServerSession(cookies);
    const formData = Object.fromEntries(await request.formData());
    const result = updateMyAnimeListStatusSchema.safeParse(formData);

    if (result.success === false) {
        const msg = result.error.issues.map(issue => `${issue.path}: ${issue.message}`)[0];
        console.error({ error: JSON.stringify(result.error, null, 2) })
        throw error(400, msg)
    }

    const malClient = new MALClient({ accessToken });
    const animeId = Number(params.anime_id);
    const data = result.data;

    const updateResult = await malClient.updateMyAnimeListStatus(animeId, {
        score: data.score,
        status: data.status,
        num_watched_episodes: data.num_watched_episodes
    });

    const userName = locals.session?.user.name || '<unknown>';

    // Update the cache, we don't care if it fails
    try {
        console.log(`🕑 Updating anime '${animeId}' from user '${userId}' (${userName}) cache`);
        const result = await UserAnimeListService.updateMyUserAnimeList({
            userId,
            accessToken,
            animeId,
            data
        });

        if (result) {
            console.log(`Anime '${animeId}' was updated for user '${userId}' cache`)
        }
    }
    catch (err) {
        console.error(`Failed to update anime cache for user '${userId}' (${userName}`, err);
    }

    return Response.json(updateResult)
}

export const DELETE: RequestHandler = async ({ params, cookies, locals }) => {
    const { userId, accessToken } = await getRequiredServerSession(cookies);
    const malClient = new MALClient({ accessToken });
    const animeId = Number(params.anime_id);

    const deletedResult = await malClient.deleteMyAnimeListStatus(animeId);
    const userName = locals.session?.user.name || '<unknown>';

    // Delete anime from cache
    try {
        console.log(`🕑 Deleting anime '${animeId}' from user '${userId}' (${userName}) cache`);

        await UserAnimeListService.deleteUserAnime(userId, animeId);

        console.log(`Anime '${animeId}' was deleted for user '${userId}' cache`)
    }
    catch (err) {
        console.error(`Failed to delete anime '${animeId}' for user ${userId} (${userName}) cache`, err)
    }

    return Response.json(deletedResult);
}