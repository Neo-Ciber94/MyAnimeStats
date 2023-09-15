import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    if (event.locals.session) {
        return { session: event.locals.session }
    }

    return { session: null }
}