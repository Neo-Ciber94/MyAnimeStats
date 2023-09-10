import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import type { RequestHandler } from "./$types";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import type { AnimeApiResponse } from "@/hooks/useAnimeListQuery";
import { AnimeHelper } from "@/lib/myanimelist/common/helper";
import { AnimeListService } from "@/lib/server/services/animeListService";
import Enumerable from "linq";
import { z } from 'zod'
import { error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
    const { userId } = await getRequiredServerSession(cookies);

    const { season, year } = AnimeHelper.getCurrentAnimeSeason();
    const userAnimeList = await UserAnimeListService.getUserAnimeList(userId);

    if (userAnimeList?.animeList == null) {
        return Response.json({ data: [] } satisfies AnimeApiResponse)
    }

    const seasonAnimeList = await AnimeListService.getSeasonAnime({ season, year });
    const seasonAnimeToWatch = Enumerable.from(seasonAnimeList)
        .where(({ node }) => {
            const anime = userAnimeList.animeList.find(x => x.node.id === node.id);

            // If anime is not in the user list or is planning to watch it, we add it to the list
            return anime == null || anime?.list_status?.status === 'plan_to_watch';
        })
        .toArray();

    return Response.json({ data: seasonAnimeToWatch } satisfies AnimeApiResponse)
}

export const POST: RequestHandler = async ({ cookies, request }) => {
    const { userId } = await getRequiredServerSession(cookies);

    const watchListSchema = z.object({
        animeList: z.array(z.record(z.unknown()))
    });

    const result = watchListSchema.safeParse(await request.json());

    if (!result.success) {
        throw error(400, "Invalid watchlist request");
    }

    console.log("Saving watchlist", { userId, result });
    return Response.json({ success: true })
}