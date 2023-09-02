import type { Handle } from "@sveltejs/kit";
import { createMiddlewareHandler } from "./lib/middlewares/handle";

const middlewareHandle = createMiddlewareHandler();

export const handle = (async ({ event, resolve }) => {
    const response = await middlewareHandle({ event, resolve });
    return response;
}) satisfies Handle;

