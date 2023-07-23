import type { RequestHandler } from "./$types";

export const GET = reverseProxy();
export const POST = reverseProxy();
export const PUT = reverseProxy();
export const PATCH = reverseProxy();
export const DELETE = reverseProxy();
export const HEAD = reverseProxy();

function reverseProxy(): RequestHandler {
    return async ({ request, params }) => {
        const apiUrl = `https://api.myanimelist.net/v2`
        const { search } = new URL(request.url);
        const url = `${apiUrl}/${params.myanimelist}${search}`
        const init: RequestInit = {
            method: request.method,
            body: request.body,
            headers: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                Authorization: request.headers.get('Authorization')!,
            }
        };
        const res = await fetch(url, init);
        return res;
    }
}