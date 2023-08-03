/* eslint-disable @typescript-eslint/no-namespace */
import type { AnimeApiResponse, AnimeNode, AnimeRankingApiResponse, AnimeSeason, AnimeStatusApiResponse, RankingType, WatchStatus } from "../common/types";
import type { User } from "../common/user";

type Empty = Record<string, never>

interface MyAnimeListOptions {
    accessToken?: string;
    clientId?: string;
}

export interface GetMyUserInfoOptions {
    accessToken: string;
    fields?: string[];
}

export interface GetAnimeListOptions extends MyAnimeListOptions {
    q?: string;
    limit?: number,
    offset?: number;
    fields?: string[]
}

export interface GetAnimeRankingOptions extends MyAnimeListOptions {
    ranking_type: RankingType,
    limit?: number;
    offset?: number;
    fields?: string[]
}

export interface GetSeasonalAnimeOptions extends MyAnimeListOptions {
    year: number,
    season: AnimeSeason,
    sort?: 'anime_score' | 'anime_num_list_users',
    limit?: number;
    offset?: number;
    fields?: string[]
}

export interface GetSuggestedAnimeOptions {
    accessToken: string;
    limit?: number;
    offset?: number;
    fields?: string[];
}

export interface UpdateMyAnimeListStatusOptions {
    accessToken: string;
    status?: WatchStatus;
    is_rewatching?: boolean;
    score?: number;
    priority?: number;
    num_times_rewatched?: number;
    rewatch_value?: number;
    tags?: string;
    comments?: string;
}

export interface GetUserAnimeListOptions extends MyAnimeListOptions {
    status?: WatchStatus,
    sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id',
    limit?: number;
    offset?: number;
}

function getApiUrl() {
    /**
     * We cannot send request from the browser directly to myanimelist we need a proxy for that
     * https://myanimelist.net/forum/?topicid=1924562
     */

    // URL to access from the proxy server: https://api.myanimelist.net/v2
    // return process.env.MY_ANIME_LIST_API_URL ?? "/api/myanimelist";
    return "https://api.myanimelist.net/v2"
}

interface MALRequestInit {
    fetch?: typeof fetch,
    resource: `/${string}`;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, unknown>,
    accessToken?: string;
    clientId?: string;
    returnNullOn404?: boolean;
    headers?: Record<string, string>;
    body?: BodyInit | null | undefined;
}

function sendRequest<T extends object>(init: MALRequestInit & { returnNullOn404: true }): Promise<T | null>
function sendRequest<T extends object>(init: MALRequestInit & { returnNullOn404?: undefined }): Promise<T>
async function sendRequest<T extends object>(init: MALRequestInit): Promise<T | null> {
    const {
        resource,
        method,
        accessToken,
        clientId,
        body,
        params,
        returnNullOn404 = false,
        fetch: fetchFunction = global.fetch,
        ...rest
    } = init;

    let url = `${getApiUrl()}${resource}`;
    const headers: Record<string, string> = rest.headers || {};

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

    if (accessToken == null && clientId == null) {
        throw new Error("access token or client id are required");
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    if (clientId) {
        headers["X-MAL-CLIENT-ID"] = clientId;
    }

    const res = await fetchFunction(url, {
        method,
        headers,
        body
    });

    if (returnNullOn404 === true && res.status === 404) {
        return null;
    }

    if (!res.ok) {
        const msg = await res.text();
        console.error(`❌ ${msg}`);
        throw new Error(msg);
    }

    const data = await res.json();
    return data;
}

export namespace MyAnimeListAPI {
    export async function getAnimeList(options: GetAnimeListOptions): Promise<AnimeApiResponse> {
        const { accessToken, fields = [], ...rest } = options;

        const result = await sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: '/anime',
            accessToken,
            params: {
                q: rest.q,
                limit: rest.limit,
                offset: rest.offset,
                fields: fields.length === 0 ? undefined : fields.join(",")
            }
        });

        return result;
    }

    export async function getAnimeDetails(animeId: number, options: MyAnimeListOptions & { fields?: string[] }) {
        const { accessToken, clientId, fields = [] } = options;

        const result = await sendRequest<AnimeNode['node']>({
            method: 'GET',
            resource: `/anime/${animeId}`,
            returnNullOn404: true,
            accessToken,
            clientId,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(",")
            }
        });

        return result;
    }

    export async function getAnimeRanking(options: GetAnimeRankingOptions) {
        const { accessToken, clientId, fields = [], ...params } = options;

        const result = await sendRequest<AnimeRankingApiResponse>({
            method: 'GET',
            resource: `/anime/ranking`,
            accessToken,
            clientId,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    export async function getSeasonalAnime(options: GetSeasonalAnimeOptions) {
        const { accessToken, clientId, fields = [], year, season, ...params } = options;

        const result = await sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: `/anime/season/${year}/${season}`,
            accessToken,
            clientId,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    export async function getSuggestedAnime(options: GetSuggestedAnimeOptions) {
        const { accessToken, fields = [], ...params } = options;

        const result = await sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: `/anime/suggestions`,
            accessToken,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    export async function updateMyAnimeListStatus(animeId: number, options: UpdateMyAnimeListStatusOptions) {
        const { accessToken, ...rest } = options;

        const body = new URLSearchParams();

        for (const [key, value] of Object.entries(rest)) {
            if (value === undefined) {
                continue;
            }

            body.set(key, String(value));
        }

        const result = await sendRequest<AnimeNode['node']>({
            method: 'PATCH',
            resource: `/anime/${animeId}/my_list_status`,
            accessToken,
            returnNullOn404: true,
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return result;
    }

    export async function deleteMyAnimeListStatus(animeId: number, options: { accessToken: string }) {
        const { accessToken } = options;

        const result = await sendRequest<Empty>({
            method: 'DELETE',
            resource: `/anime/${animeId}/my_list_status`,
            accessToken,
            returnNullOn404: true,
        });

        return result;
    }

    export async function getUserAnimeList(userName: string, options: GetUserAnimeListOptions) {
        const { accessToken, clientId, ...params } = options;

        const result = await sendRequest<AnimeStatusApiResponse>({
            method: 'GET',
            resource: `/users/${userName}/animelist`,
            accessToken,
            clientId,
            params
        });

        return result;
    }

    export async function getMyUserInfo(options: GetMyUserInfoOptions): Promise<User> {
        const { accessToken, fields = [] } = options;

        const result = await sendRequest<User>({
            method: 'GET',
            resource: "/users/@me",
            accessToken,
            params: {
                fields: fields.length > 0 ? fields.join(",") : undefined
            },
        });

        return result;
    }
}