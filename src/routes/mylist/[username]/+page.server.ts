import { getRequiredServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListCacheService } from "@/lib/services/userAnimeListCacheService";

export const load: PageServerLoad = async ({ cookies, params: { username } }) => {
    // Currently we only support displaying the current user anime list
    if (username !== '@me') {
        return {
            data: {
                userAnimeList: null,
                username
            },
        }
    }

    const { userId } = await getRequiredServerSession(cookies);
    const userAnimeList = await UserAnimeListCacheService.getAnimeList(userId);

    return {
        data: {
            userAnimeList,
            username
        },

    }
};