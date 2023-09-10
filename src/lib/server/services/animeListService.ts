/* eslint-disable @typescript-eslint/no-namespace */

import { MY_ANIME_LIST_CLIENT_ID } from "$env/static/private";
import { z } from "zod";
import { KV } from "$lib/server/kv";
import { MALClient } from "$lib/myanimelist/api";
import type { AnimeObject, AnimeObjectWithRanking, AnimeSeason } from "$lib/myanimelist/common/types";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs from 'dayjs';
import { Retry, runAndRetryOnThrow } from "@/lib/utils/retry";
import ANIME_GENRES from "@/generated/animeGenres";
import { RedisService } from "../cache";
import Enumerable from "linq";
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

    type GetSeasonAnimeOptions = {
        season: AnimeSeason,
        year: number,
        offset?: number,
        limit?: number,
        nsfw?: boolean
    }

    export async function getSeasonAnime(opts: GetSeasonAnimeOptions) {
        const { season, year, offset = 0, limit = 500, nsfw = false } = opts;
        const malClient = new MALClient({
            clientId: MY_ANIME_LIST_CLIENT_ID
        })

        const cacheKey = `anime/${year}/${season}`;
        let animeList: AnimeObject[] | null = await RedisService.get<AnimeObject[]>(cacheKey);

        if (!animeList) {
            animeList = [];
            const currentLimit = 500;
            let currentOffset = 0;

            const getAnimeList = () => malClient.getSeasonalAnime({
                season,
                year,
                limit: currentLimit,
                offset: currentOffset,
                sort: 'anime_num_list_users',
                nsfw: true,
                fields: [
                    "nsfw",
                    "genres",
                    "status",
                    "mean",
                    'start_season',
                    'broadcast',
                    'main_picture',
                    'alternative_titles',
                    'rank',
                    'rating'
                ],
            });

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const result = await runAndRetryOnThrow(getAnimeList, Retry.exponential({ attends: 6 }), true);
                animeList.push(...result.data);

                console.log({ data: result })
                if (result.paging?.next == null) {
                    break;
                }

                currentOffset += currentLimit;
            }

            // We only cache if we had data
            if (animeList.length > 0) {
                await RedisService.set(cacheKey, animeList, {
                    ex: 1000 * 60 * 60 * 3, // 3 hours of cache
                })
            }
        }

        const result = Enumerable.from(animeList)
            .where(({ node }) => {
                const isNsfw = node.genres?.some(x => x.id === ANIME_GENRES.Hentai.ID);
                if (isNsfw && nsfw === false) {
                    return false;
                }
                return true;
            })
            .skip(offset)
            .take(limit)
            .toArray();

        return result;
    }
}