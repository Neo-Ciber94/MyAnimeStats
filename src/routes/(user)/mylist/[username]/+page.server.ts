import { getServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, redirect } from "@sveltejs/kit";
import { UserService } from "@/lib/server/services/userService";

export const load: PageServerLoad = async ({ cookies, params: { username } }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw redirect(307, "/");
    }

    const userId = username === "@me" ? session.userId : await UserService.getUserIdFromUsername(username);

    if (userId == null) {
        throw error(404, "User not found");
    }

    const userAnimeList = await UserAnimeListService.getUserAnimeListById(userId);

    return {
        data: { userAnimeList }
    }
};