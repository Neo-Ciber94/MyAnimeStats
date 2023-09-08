/* eslint-disable @typescript-eslint/no-namespace */

import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";
import { z } from "zod";
import { KV } from "$lib/server/kv";
import { MALClient } from "$lib/myanimelist/api";
import type { AnimeObjectWithRanking } from "$lib/myanimelist/common/types";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs from 'dayjs';
dayjs.extend(isSameOrAfter);

const POPULAR_ANIME_KEY = 'most_popular_anime';

const popularAnimeListSchema = z.object({
    popularAnimeList: z.array(z.record(z.unknown())),
    lastUpdated: z.coerce.date()
})

export namespace AnimeListService {
    export async function calculatePopularAnimeList() {
        console.log("🕑 Fetching most popular anime");

        const malClient = new MALClient({ clientId: MY_ANIME_LIST_CLIENT_ID });
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
                'popularity',
                'num_scoring_users',
                'num_list_users',
            ]
        });

        const kv = KV.current();
        const popularAnimeList = result.data;

        await kv.set(POPULAR_ANIME_KEY, popularAnimeListSchema, {
            popularAnimeList,
            lastUpdated: new Date()
        })

        console.log(`✅ fetched ${popularAnimeList.length} popular anime`)
        return popularAnimeList;
    }

    export async function getPopularAnimeList(opts?: { force?: boolean }) {
        const { force = false } = opts || {};

        if (force === true) {
            return calculatePopularAnimeList();
        }

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