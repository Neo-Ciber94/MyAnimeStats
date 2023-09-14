import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    if (event.locals.authenticatedUser) {
        return { session: event.locals.authenticatedUser }
    }

    return { session: null }
}