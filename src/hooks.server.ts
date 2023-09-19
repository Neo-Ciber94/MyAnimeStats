import type { Handle, HandleServerError } from "@sveltejs/kit";
import { createMiddlewareHandler } from "./lib/server/middlewares";
import { logger } from "./lib/server/logger";

const middlewareHandle = createMiddlewareHandler();

export const handle = (async ({ event, resolve }) => {
    const response = await middlewareHandle({ event, resolve });
    return response;
}) satisfies Handle;

export const handleError: HandleServerError = (input) => {
    const error = input.error?.toString();
    logger.error({ error });

    return {
        message: 'Something went wrong',
    };
};