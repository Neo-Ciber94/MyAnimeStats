/* eslint-disable @typescript-eslint/no-namespace */
import type { AnimeApiResponse, AnimeNode, AnimeRankingApiResponse, AnimeSeason, AnimeStatusApiResponse, RankingType, WatchStatus } from "../common/types";
import type { User } from "../common/user";

type Empty = Record<string, never>

type AnimeFields = (keyof AnimeNode['node']) | (string & Empty);

type UserFields = (keyof User) | (string & Empty);

export interface GetMyUserInfoOptions {
    fields?: UserFields[];
}

export interface GetAnimeListOptions {
    q?: string;
    limit?: number,
    offset?: number;
    fields?: AnimeFields[];
    nsfw?: boolean;
}

export interface GetAnimeRankingOptions {
    ranking_type: RankingType,
    limit?: number;
    offset?: number;
    fields?: AnimeFields[]
    nsfw?: boolean;
}


export interface GetSeasonalAnimeOptions {
    year: number,
    season: AnimeSeason,
    sort?: 'anime_score' | 'anime_num_list_users',
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
    nsfw?: boolean;
}

export interface GetSuggestedAnimeOptions {
    limit?: number;
    offset?: number;
    fields?: AnimeFields[];
    nsfw?: boolean;
}

export interface UpdateMyAnimeListStatusOptions {
    status?: WatchStatus;
    is_rewatching?: boolean;
    score?: number;
    priority?: number;
    num_times_rewatched?: number;
    rewatch_value?: number;
    tags?: string;
    comments?: string;
}

export interface GetUserAnimeListOptions {
    status?: WatchStatus,
    sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id',
    fields?: AnimeFields[];
    limit?: number;
    offset?: number;
    nsfw?: boolean;
}

interface MALClientConfig {
    fetch?: typeof fetch,
    accessToken?: string;
    clientId?: string;
    proxyUrl?: string;
}

interface MALRequestInit {
    resource: `/${string}`;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, unknown>,
    returnNullOn404?: boolean;
    headers?: Record<string, string>;
    body?: BodyInit | null | undefined;
}

type UserName = "@me" | (string & Empty)

export class MalHttpError extends Error {
    constructor(public readonly status: number, message: string, cause?: unknown) {
        super(message, { cause })
    }
}

export class MALClient {
    #config: MALClientConfig;

    constructor(config: MALClientConfig = {}) {
        if (config.accessToken == null && config.clientId == null) {
            throw new Error("access token or client id are required");
        }

        // shallow copy to prevent modifying the original
        this.#config = { ...config };
    }

    private sendRequest<T extends object>(init: MALRequestInit & { returnNullOn404: true }): Promise<T | null>
    private sendRequest<T extends object>(init: MALRequestInit & { returnNullOn404?: undefined }): Promise<T>
    private async sendRequest<T extends object>(init: MALRequestInit): Promise<T | null> {
        const {
            resource,
            method,
            body,
            params,
            returnNullOn404 = false,
            headers = {},
        } = init;

        const {
            accessToken,
            clientId,
            fetch: fetchFunction = global.fetch,
            proxyUrl,
        } = this.#config;

        const apiUrl = proxyUrl ?? "https://api.myanimelist.net/v2";
        let url = `${apiUrl}${resource}`;

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

        // We ignore the client id if we had the access token
        if (clientId && accessToken == null) {
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
            throw new MalHttpError(res.status, msg);
        }

        const data = await res.json() as T;
        return data;
    }

    async getAnimeList(options: GetAnimeListOptions): Promise<AnimeApiResponse> {
        const { fields = [], ...rest } = options;

        const result = await this.sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: '/anime',
            params: {
                q: rest.q,
                limit: rest.limit,
                offset: rest.offset,
                fields: fields.length === 0 ? undefined : fields.join(",")
            }
        });

        return result;
    }

    async getAnimeDetails(animeId: number, options: { fields?: AnimeFields[] }) {
        const { fields = [] } = options;

        const result = await this.sendRequest<AnimeNode['node']>({
            method: 'GET',
            resource: `/anime/${animeId}`,
            returnNullOn404: true,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(",")
            }
        });

        return result;
    }

    async getAnimeRanking(options: GetAnimeRankingOptions) {
        const { fields = [], ...params } = options;

        const result = await this.sendRequest<AnimeRankingApiResponse>({
            method: 'GET',
            resource: `/anime/ranking`,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    async getSeasonalAnime(options: GetSeasonalAnimeOptions) {
        const { fields = [], year, season, ...params } = options;

        const result = await this.sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: `/anime/season/${year}/${season}`,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    async getSuggestedAnime(options: GetSuggestedAnimeOptions) {
        const { fields = [], ...params } = options;

        const result = await this.sendRequest<AnimeApiResponse>({
            method: 'GET',
            resource: `/anime/suggestions`,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    async updateMyAnimeListStatus(animeId: number, options: UpdateMyAnimeListStatusOptions) {
        const { ...rest } = options;

        const body = new URLSearchParams();

        for (const [key, value] of Object.entries(rest)) {
            if (value === undefined) {
                continue;
            }

            body.set(key, String(value));
        }

        const result = await this.sendRequest<AnimeNode['node']>({
            method: 'PATCH',
            resource: `/anime/${animeId}/my_list_status`,
            returnNullOn404: true,
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return result;
    }

    async deleteMyAnimeListStatus(animeId: number) {
        const result = await this.sendRequest<Empty>({
            method: 'DELETE',
            resource: `/anime/${animeId}/my_list_status`,
            returnNullOn404: true,
        });

        return result;
    }

    async getUserAnimeList(userName: UserName, options: GetUserAnimeListOptions) {
        const { fields = [], ...params } = options;

        const result = await this.sendRequest<AnimeStatusApiResponse>({
            method: 'GET',
            resource: `/users/${userName}/animelist`,
            params: {
                fields: fields.length === 0 ? undefined : fields.join(","),
                ...params
            }
        });

        return result;
    }

    async getMyUserInfo(options: GetMyUserInfoOptions): Promise<User> {
        const { fields = [] } = options;

        const result = await this.sendRequest<User>({
            method: 'GET',
            resource: "/users/@me",
            params: {
                fields: fields.length > 0 ? fields.join(",") : undefined
            },
        });

        return result;
    }
}