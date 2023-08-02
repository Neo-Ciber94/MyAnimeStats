import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    const result = await resolve(event);
    return result;
}) satisfies Handle;