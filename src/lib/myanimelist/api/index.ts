/* eslint-disable @typescript-eslint/no-namespace */
import type { User } from "../common/user";


export interface GetMyUserInfoOptions {
    accessToken: string;
    fields?: string[];
}

function getApiUrl() {
    /**
     * We cannot send request from the browser directly to myanimelist we need a proxy for that
     * https://myanimelist.net/forum/?topicid=1924562
     */

    // URL to access from the proxy server: https://api.myanimelist.net/v2
    return process.env.MY_ANIME_LIST_API_URL ?? "/api/myanimelist";
}

interface MALRequestInit {
    resource: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, unknown>,
    accessToken?: string;
    clientId?: string;
}

async function sendRequest(init: MALRequestInit): Promise<unknown> {
    const {
        resource,
        method,
        accessToken,
        clientId,
        params
    } = init;

    let url = `${getApiUrl()}/${resource}`;
    const headers: Record<string, string> = {};

    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined) {
                continue;
            }

            searchParams.set(key, String(value));
        }

        url += "?" + searchParams.toString()
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    if (clientId) {
        headers["X-MAL-CLIENT-ID"] = clientId;
    }

    const res = await fetch(url, {
        method,
        headers
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const data = await res.json();
    return data;
}

export namespace MyAnimeListAPI {
    export async function getMyUserInfo(options: GetMyUserInfoOptions): Promise<User> {
        const { accessToken, fields = [] } = options;

        const result = await sendRequest({
            method: 'GET',
            resource: "/users/@me",
            accessToken,
            params: {
                fields: fields.length > 0 ? fields.join(",") : undefined
            },
        });

        return result as User;
    }
}