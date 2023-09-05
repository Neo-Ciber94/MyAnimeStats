/* eslint-disable @typescript-eslint/no-namespace */

import { PUBLIC_MY_ANIME_LIST_CLIENT_ID } from "$env/static/public";
import { z } from "zod";
import { KV } from "../kv";
import { MALClient } from "../myanimelist/api";
import dayjs from "dayjs";
import type { AnimeObjectWithRanking } from "../myanimelist/common/types";

const POPULAR_ANIME_KEY = 'most_popular_anime';

const popularAnimeListSchema = z.object({
    popularAnimeList: z.array(z.record(z.unknown())),
    lastUpdated: z.string().pipe(z.date())
})

export namespace AnimeListService {
    export async function calculatePopularAnimeList() {
        const malClient = new MALClient({ clientId: PUBLIC_MY_ANIME_LIST_CLIENT_ID });
        const result = await malClient.getAnimeRanking({
            limit: 50,
            ranking_type: 'tv',
            fields: [
                'mean',
                'media_type',
                'start_date',
                'end_date',
                'rating',
                'rank',
                'alternative_titles',
                'average_episode_duration',
                'popularity']
        });

        const kv = KV.current();
        const popularAnimeList = result.data;
        await kv.set(POPULAR_ANIME_KEY, popularAnimeListSchema, {
            popularAnimeList,
            lastUpdated: new Date()
        })

        return popularAnimeList;
    }

    export async function getPopularAnimeList() {
        const kv = KV.current();
        const result = await kv.get(POPULAR_ANIME_KEY, popularAnimeListSchema);

        if (result == null) {
            return calculatePopularAnimeList();
        }

        const expirationDate = dayjs(result.lastUpdated).add(6, 'hour');

        if (dayjs().isSameOrAfter(expirationDate, 'hour')) {
            return calculatePopularAnimeList();
        }

        return result.popularAnimeList as AnimeObjectWithRanking[];
    }
}