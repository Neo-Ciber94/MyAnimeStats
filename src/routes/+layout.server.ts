import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (locals.authenticatedUser) {
        return { session: locals.authenticatedUser }
    }

    return { session: null }
};