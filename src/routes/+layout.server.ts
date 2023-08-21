import { getServerSession } from "@/lib/myanimelist/svelte/auth";
import type { LayoutServerLoad } from "./$types";
import { MALClient } from "@/lib/myanimelist/api";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        return { session: undefined };
    }

    const { accessToken } = session;
    const malClient = new MALClient({ accessToken });

    try {
        const user = await malClient.getMyUserInfo({ fields: [] });
        locals.authenticatedUser = { user, accessToken };
        return { session: { user, accessToken } };
    }
    catch (err) {
        console.error(err);
        return { session: undefined };
    }
};