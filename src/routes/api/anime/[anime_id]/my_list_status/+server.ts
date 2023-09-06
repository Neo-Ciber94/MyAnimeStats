import { MALClient } from "@/lib/myanimelist/api";
import { watchStatusSchema } from "@/lib/myanimelist/common/types";
import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import { UserAnimeListService } from "@/lib/services/userAnimeListService";
import { error, type RequestHandler } from "@sveltejs/kit";
import { z } from 'zod';

const updateMyAnimeListStatusSchema = z.object({
    score: z.string().pipe(z.coerce.number().min(0).max(10)),
    status: watchStatusSchema,
    num_watched_episodes: z.string().pipe(z.coerce.number().min(0)),
})

export const PATCH: RequestHandler = async ({ request, params, cookies }) => {
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

    // Update the cache, we don't care if it fails
    try {
        console.log(`🕑 Updating cache for user: '${userId}' and anime '${animeId}'`);
        const result = await UserAnimeListService.updateMyUserAnimeList(userId, animeId, data);

        if (result) {
            console.log(`User '${userId}' cache was updated for anime '${animeId}'`)
        }
    }
    catch (err) {
        console.error(`Failed to update user anime cache`, err);
    }

    return Response.json(updateResult)
}