import type { Handle } from "@sveltejs/kit";
import { createMiddlewareHandler } from "./lib/server/middlewares";


export const handle = (async ({ event, resolve }) => {
    const middlewareHandle = createMiddlewareHandler();
    const response = await middlewareHandle({ event, resolve });
    return response;
}) satisfies Handle;