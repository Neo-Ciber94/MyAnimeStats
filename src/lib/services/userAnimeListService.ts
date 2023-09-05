/* eslint-disable @typescript-eslint/no-namespace */
import { error, type Cookies } from "@sveltejs/kit";
import { KV } from "../kv";
import { MALClient, MalHttpError } from "../myanimelist/api";
import type { AnimeObjectWithStatus } from "../myanimelist/common/types";
import { userAnimeListSchema } from "../types";
import { Retry, runAndRetryOnThrow } from "../utils/retry";
import { getRequiredServerSession } from "../myanimelist/svelte/auth";

function getKey(userId: number) {
    return `userAnimeList/${userId}`;
}

export namespace UserAnimeListService {
    export async function getUserAnimeList(userId: number) {
        const key = getKey(userId);
        const kv = KV.current();
        const result = await kv.get(key, userAnimeListSchema);

        if (result == null) {
            return null;
        }

        return {
            ...result,
            animeList: result.animeList as AnimeObjectWithStatus[],
        }
    }

    export async function fetchCurrentUserAnimeList(cookies: Cookies) {
        const { userId, accessToken } = await getRequiredServerSession(cookies);
        const animeList = await fetchCurrentUserAnimeListInternal(accessToken);

        const userAnimeList = {
            animeList,
            lastUpdated: new Date()
        };

        const kv = KV.current();
        await kv.set(getKey(userId), userAnimeListSchema, userAnimeList);
        return animeList;
    }
}

async function fetchCurrentUserAnimeListInternal(accessToken: string) {
    const anime: AnimeObjectWithStatus[] = [];
    const batchSize = 500;
    let offset = 0;

    const malClient = new MALClient({ accessToken });

    const getAnimeList = () => malClient.getUserAnimeList("@me", {
        limit: batchSize,
        offset,
        fields: [
            'genres',
            'start_season',
            'studios',
            'my_list_status',
            'end_date',
            'list_status',
            'status',
            'mean',
            'rank'
        ]
    });

    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const res = await runAndRetryOnThrow(getAnimeList, Retry.exponential({ attends: 6 }), true);
            const data = res.data;
            anime.push(...data);

            if (res.paging.next == null) {
                break;
            }
        }
        catch (err) {
            console.error(err);

            if (err instanceof MalHttpError) {
                throw error(err.status, err.message ?? "failed to load myanimelist");
            }

            throw error(500, err?.toString() ?? "failed to load myanimelist");
        }

        offset += batchSize;
    }

    return anime;
}