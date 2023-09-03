import type { Handle } from "@sveltejs/kit";
import { createMiddlewareHandler } from "./lib/middlewares/handle";

// TODO: use `sequence` instead: https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence
const middlewareHandle = createMiddlewareHandler();

export const handle = (async ({ event, resolve }) => {
    const response = await middlewareHandle({ event, resolve });
    return response;
}) satisfies Handle;

