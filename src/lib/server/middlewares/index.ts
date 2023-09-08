import type { Handle, MaybePromise, RequestEvent } from "@sveltejs/kit";

export type Next = (event: RequestEvent) => MaybePromise<Response>;

export type Middleware = (event: RequestEvent, next: Next) => MaybePromise<Response>;

export function combineMiddlewares(middlewares: [Middleware, ...Middleware[]]): Handle {
    return async ({ event, resolve }) => {
        const handleMiddleware = async (index: number): Promise<Response> => {
            if (index === middlewares.length) {
                return resolve(event);
            }

            const next: Next = () => handleMiddleware(index + 1);
            const response = await Promise.resolve(middlewares[index](event, next));
            return response;
        };

        return handleMiddleware(0);
    }
}