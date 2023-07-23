import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const GET = reverseProxy();
export const POST = reverseProxy();
export const PUT = reverseProxy();
export const PATCH = reverseProxy();
export const DELETE = reverseProxy();
export const HEAD = reverseProxy();

function reverseProxy(): RequestHandler {
    return async ({ request, params }) => {
        const authorization = request.headers.get('Authorization');
        const headers: HeadersInit = {};

        if (authorization) {
            headers.Authorization = authorization;
        } else {
            headers["X-MAL-CLIENT-ID"] = MY_ANIME_LIST_CLIENT_ID;
        }

        const apiUrl = `https://api.myanimelist.net/v2`
        const { search } = new URL(request.url);
        const url = `${apiUrl}/${params.myanimelist}${search}`
        const init: RequestInit = {
            method: request.method,
            body: request.body,
            headers
        };

        console.log(`📝 ${request.method}: ${url}`)
        const res = await fetch(url, init);
        return res;
    }
}