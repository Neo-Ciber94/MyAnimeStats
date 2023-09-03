/* eslint-disable @typescript-eslint/no-namespace */
import { KV } from "../kv";
import type { AnimeObjectWithStatus } from "../myanimelist/common/types";
import { userAnimeListSchema } from "../types";

function getKey(userId: number) {
    return `userAnimeList/${userId}`;
}

export namespace UserAnimeListCacheService {
    export async function getAnimeList(userId: number) {
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

    export async function setAnimeList(userId: number, animeList: AnimeObjectWithStatus[]) {
        const key = getKey(userId);
        const kv = KV.current();

        const userAnimeList = {
            animeList,
            lastUpdated: new Date()
        };

        await kv.set(key, userAnimeListSchema, userAnimeList);
        return userAnimeList;
    }
}