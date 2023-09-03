import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListCacheService } from "@/lib/services/userAnimeListCache";

export const load: PageServerLoad = async ({ cookies }) => {
    const { userId } = await getRequiredServerSession(cookies);
    const userAnimeList = await UserAnimeListCacheService.getAnimeList(userId);

    return {
        data: userAnimeList
    }
};