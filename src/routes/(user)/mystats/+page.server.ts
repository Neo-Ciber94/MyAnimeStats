/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeNode, AnimeObjectWithStatus } from "$lib/myanimelist/common/types";
import { calculatePersonalStats, type CalculatedStats } from "$lib/utils/calculatePersonalStats.server";
import { getRequiredServerSession, getServerSession } from "$lib/myanimelist/svelte/auth";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs from 'dayjs';
import { UserAnimeListService } from "@/lib/server/services/userAnimeListService";
import { UserStatsService } from "@/lib/server/services/userStatsService";
import { dev } from "$app/environment";
import { Parser as CSVParser } from '@json2csv/plainjs';
dayjs.extend(isSameOrAfter);

const RECALCULATE_WAIT_DAYS = 1;

export const load = (async ({ locals }) => {
    if (locals.authenticatedUser == null) {
        throw redirect(307, "/");
    }

    try {
        const userId = locals.authenticatedUser.user.id;

        const userAnimeList = await UserAnimeListService.getUserAnimeList(userId);
        const userAnimeStats = await UserStatsService.getStats(userId);

        if (userAnimeList == null || userAnimeStats == null) {
            return { data: null }
        }

        const dayToRecalculate = dayjs(userAnimeStats.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
        const canRecalculate = dayjs(userAnimeStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day') || dev;

        return {
            data: {
                stats: userAnimeStats.stats,
                animeList: userAnimeList.animeList as AnimeObjectWithStatus[],
                lastUpdated: userAnimeList.lastUpdated,
                canRecalculate
            }
        }
    }
    catch (err) {
        console.error(err);
        return { data: null }
    }
}) satisfies PageServerLoad;

export const actions = {
    async calculate({ cookies }) {
        const session = await getServerSession(cookies);

        if (session == null) {
            throw redirect(307, "/");
        }

        try {
            const { userStats, animeList } = await calculateUserStats(cookies);
            const dayToRecalculate = dayjs(userStats.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
            const canRecalculate = dayjs(userStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day') || dev;

            return {
                data: {
                    stats: userStats.stats,
                    animeList,
                    lastUpdated: userStats.lastUpdated,
                    canRecalculate
                }
            }
        }
        catch (err) {
            console.error(err);
            throw error(400, "Failed to calculate stats");
        }
    },

    async downloadJson({ locals, setHeaders }) {
        const userId = locals.authenticatedUser?.user.id;

        if (!userId) {
            throw error(401);
        }

        try {
            const data = await UserAnimeListService.getUserAnimeList(userId);
            if (data == null) {
                throw error(404);
            }

            const { animeList } = data;
            setHeaders({ 'Content-Type': 'text/json' });
            const json = JSON.stringify(animeList);
            return json;
        }
        catch (err) {
            console.error(err);
            throw error(500, "Failed to get json data");
        }
    },

    async downloadCsv({ locals, setHeaders }) {
        const userId = locals.authenticatedUser?.user.id;

        if (!userId) {
            throw error(401);
        }

        try {
            const data = await UserAnimeListService.getUserAnimeList(userId);
            if (data == null) {
                throw error(404);
            }

            const { animeList } = data;

            setHeaders({ 'Content-Type': 'text/csv' });
            if (animeList.length === 0) {
                return ''; // This should be unusual, so we don't care to just return the headers
            }

            const headers: string[] = Object.keys(animeList[0].node);
            const rows: string[] = [];

            for (const anime of animeList) {
                const row: string[] = [];
                for (const header of headers) {
                    const value = anime.node[header as keyof AnimeNode];

                    switch (typeof value) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                        case 'bigint':
                            row.push(String(value))
                            break;
                        case 'object': {
                            if (Array.isArray(value)) {
                                const arrayValues = value.map(x => JSON.stringify(x)).join(',');
                                row.push(arrayValues);
                            } else {
                                row.push(JSON.stringify(value));
                            }

                            break;
                        }
                        default:
                            rows.push('');
                            break;
                    }
                }
            }

            const csv = [...headers, ...rows].join('\n');

            return csv;
        }
        catch (err) {
            console.error(err);
            throw error(500, "Failed to get json data");
        }
    },
} satisfies Actions;



async function calculateUserStats(cookies: Cookies) {
    const { userId } = await getRequiredServerSession(cookies);
    const animeList = await UserAnimeListService.fetchCurrentUserAnimeList(cookies);
    console.log(`🍙 ${animeList.length} anime loaded from user`);

    let userStats = await UserStatsService.getStats(userId);

    if (userStats) {
        return {
            userStats,
            animeList
        }
    }

    // Calculate stats
    const stats: CalculatedStats = calculatePersonalStats(animeList);

    userStats = {
        stats,
        lastUpdated: new Date()
    };

    await UserStatsService.setStats(userId, stats);

    return { userStats, animeList };
}