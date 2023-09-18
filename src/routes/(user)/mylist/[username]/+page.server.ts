import { getRequiredServerSession, getServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, params: { username } }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw redirect(307, "/");
    }
    
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
    const userAnimeList = await UserAnimeListService.getUserAnimeListById(userId);

    return {
        data: {
            userAnimeList,
            username
        },
    }
};