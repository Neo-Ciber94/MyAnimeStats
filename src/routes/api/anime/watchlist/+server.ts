import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import type { RequestHandler } from "./$types";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import type { AnimeApiResponse } from "@/hooks/useAnimeListQuery";
import { AnimeHelper } from "@/lib/myanimelist/common/helper";
import { AnimeListService } from "@/lib/server/services/animeListService";
import Enumerable from "linq";
import { z } from 'zod'
import { error } from "@sveltejs/kit";
import ANIME_GENRES from "@/generated/animeGenres";

export const GET: RequestHandler = async ({ cookies, request }) => {
    const { userId } = await getRequiredServerSession(cookies);
    const { searchParams } = new URL(request.url);
    const allowNsfw = searchParams.get('nsfw') === 'true';
    const { season, year } = AnimeHelper.getCurrentAnimeSeason();
    const userAnimeList = await UserAnimeListService.getUserAnimeList(userId);

    if (userAnimeList?.animeList == null) {
        return Response.json({ data: [] } satisfies AnimeApiResponse)
    }

    const seasonAnimeList = await AnimeListService.getSeasonAnime({ season, year });
    const seasonAnimeToWatch = Enumerable.from(seasonAnimeList)
        .where(({ node }) => {
            if (node.start_season == null) {
                return false;
            }

            const genres = node.genres || [];
            const isNsfw = genres.some(x => x.id === ANIME_GENRES.Hentai.ID);

            if (!allowNsfw && isNsfw) {
                return false;
            }

            return node.media_type !== 'music' && node.media_type !== 'unknown' && node.media_type !== 'special'
                && node.start_season.season === season
                && node.start_season.year === year;
        })
        .where(({ node }) => {
            const anime = userAnimeList.animeList.find(x => x.node.id === node.id);

            // If anime is not in the user list or is planning to watch it, we add it to the list
            return (anime == null || anime?.list_status?.status === 'plan_to_watch');
        })
        .where(anime => anime != null)
        .orderBy(anime => anime.node.popularity)
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