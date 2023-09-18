import { getServerSession } from "@/lib/myanimelist/svelte/auth";
import type { PageServerLoad } from "./$types";
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { error, redirect } from "@sveltejs/kit";
import { UserService } from "@/lib/server/services/userService";
import { invariant } from "@/lib/utils/invariant";

export const load: PageServerLoad = async ({ cookies, params, locals }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw redirect(307, "/");
    }

    const userId = params.username === "@me" ?
        session.userId :
        await UserService.getUserIdFromUsername(params.username);

    if (userId == null) {
        throw error(404, "User not found");
    }

    const userAnimeList = await UserAnimeListService.getUserAnimeListById(userId);
    const username = params.username === "@me" ?
        locals.session?.user.name :
        await UserService.getActualUserName(params.username)


    // This never is reached
    invariant(username, "User not found");

    return {
        data: {
            userAnimeList,
            username
        }
    }
};