import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListService } from "@/lib/services/userAnimeList";

export const load: PageServerLoad = async ({ cookies }) => {
    const { userId } = await getRequiredServerSession(cookies);
    const userAnimeList = await UserAnimeListService.getAnimeList(userId);
    
    return {
        data: userAnimeList
    }
};