/* eslint-disable @typescript-eslint/no-namespace */
import { error, type Cookies } from "@sveltejs/kit";
import { KV } from "$lib/server/kv";
import { MALClient, MalHttpError, type UpdateMyAnimeListStatusOptions } from "$lib/myanimelist/api";
import type { AnimeNode, AnimeObjectWithStatus } from "$lib/myanimelist/common/types";
import { Retry, runAndRetryOnThrow } from "$lib/utils/retry";
import { getRequiredServerSession } from "$lib/myanimelist/svelte/auth";
import { z } from "zod";
import { Parser as CSVParser } from '@json2csv/plainjs';

export const userAnimeListSchema = z.object({
    animeList: z.array(z.record(z.unknown())),
    lastUpdated: z.coerce.date(),
});

export type UserAnimeList = z.infer<typeof userAnimeListSchema>;

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

    export async function updateMyUserAnimeList(userId: number, animeId: number, data: UpdateMyAnimeListStatusOptions) {
        const kv = KV.current();
        const userAnimeList = await kv.get(getKey(userId), userAnimeListSchema);

        if (userAnimeList == null) {
            return null;
        }

        let updated: AnimeObjectWithStatus | null = null;
        const animeList = userAnimeList.animeList as AnimeObjectWithStatus[];

        animeList.map(anime => {
            if (anime.node.id === animeId) {
                anime.list_status = { ...anime.list_status, ...data }

                if (anime.node.my_list_status) {
                    anime.node.my_list_status = { ...anime.node.my_list_status, ...data }
                }

                updated = anime;
            }

            return anime;
        });

        if (!updated) {
            return null;
        }

        await kv.set(getKey(userId), userAnimeListSchema, { ...userAnimeList, animeList });
        return updated;
    }

    export async function deleteUserAnime(userId: number, animeId: number) {
        const kv = KV.current();
        const userAnimeList = await kv.get(getKey(userId), userAnimeListSchema);

        if (userAnimeList == null) {
            return null;
        }

        const animeList = userAnimeList.animeList as AnimeObjectWithStatus[];
        const toDelete = animeList.find(anime => anime.node.id === animeId);
        const result = animeList.filter(anime => anime.node.id !== animeId);

        // Nothing was deleted
        if (toDelete == null) {
            return null;
        }

        await kv.set(getKey(userId), userAnimeListSchema, { ...userAnimeList, animeList: result });
        return toDelete;
    }

    export async function getUserListAsJSON(userId: number) {
        const data = await UserAnimeListService.getUserAnimeList(userId);

        if (data == null) {
            return null;
        }

        const { animeList } = data;
        return JSON.stringify(animeList);
    }

    export async function getUserListAsCSV(userId: number) {
        const data = await UserAnimeListService.getUserAnimeList(userId);
        if (data == null) {
            return null;
        }

        const { animeList } = data;

        const parser = new CSVParser<AnimeNode, AnimeNode>({
            fields: [
                'id',
                'title',
                'main_picture.medium',
                'main_picture.large',
                'media_type',
                'status',
                'nsfw',
                {
                    label: 'genres',
                    value: (row: AnimeNode) => row.genres.map(x => x.name).join(',')
                },
                'mean',
                'alternative_titles.synonyms',
                'alternative_titles.en',
                'alternative_titles.ja',
                'start_date',
                'end_date',
                'synopsis',
                'rank',
                'popularity',
                'num_list_users',
                'num_scoring_users',
                'num_episodes',
                'start_season.year',
                'start_season.season',
                'average_episode_duration',
                {
                    label: 'studios',
                    value: (row: AnimeNode) => row.studios?.map(x => x.name).join(',')
                },
                'broadcast.day_of_the_week',
                'broadcast.start_time',
                'my_list_status.status',
                'my_list_status.score',
                'my_list_status.num_episodes_watched',
                'my_list_status.is_rewatching',
                'my_list_status.start_date',
                'my_list_status.finish_date',
                'my_list_status.priority',
                'my_list_status.rewatch_value',
                'my_list_status.tags',
                'my_list_status.updated_at',
                'background',
                'source',
                'related_anime',
                {
                    label: 'related_anime',
                    value: (row: AnimeNode) => row.related_anime?.map(x => x.node?.title)
                },
                'related_anime',
                {
                    label: 'related_manga',
                    value: (row: AnimeNode) => row.related_manga?.map(x => x.node?.title)
                },
                'rating',
                'pictures.medium',
                'pictures.large',
                {
                    label: 'recommendations',
                    value: (row: AnimeNode) => row.recommendations?.map(x => x.node?.title)
                },
                'statistics.num_list_users',
                'statistics.status.watching',
                'statistics.status.completed',
                'statistics.status.on_hold',
                'statistics.status.dropped',
                'statistics.status.plan_to_watch',
            ],
        });

        const nodes = animeList.map(x => x.node);
        const csv = parser.parse(nodes);
        return csv;
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
            'end_date',
            'studios',
            'my_list_status',
            'end_date',
            'list_status',
            'status',
            'mean',
            'rank',
            'num_scoring_users',
            'alternative_titles',
            'num_episodes',
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