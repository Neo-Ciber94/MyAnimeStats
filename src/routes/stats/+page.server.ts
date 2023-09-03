/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeNodeWithStatus } from "$lib/myanimelist/common/types";
import { type CalculatedStats, userAnimeStatsSchema } from "$lib/types";
import { MALClient, MalHttpError } from "$lib/myanimelist/api";
import { calculatePersonalStats } from "$lib/utils/calculatePersonalStats.server";
import { getRequiredServerSession, getServerSession } from "$lib/myanimelist/svelte/auth";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { KV } from "@/lib/kv";
import { UserAnimeListService } from "@/lib/services/userAnimeList";
import { UserStatsService } from "@/lib/services/userStats";
dayjs.extend(isSameOrAfter);

const RECALCULATE_WAIT_DAYS = 1;

export const load = (async ({ locals }) => {
    if (locals.authenticatedUser == null) {
        throw redirect(307, "/");
    }

    try {
        const kv = KV.current();
        const userId = locals.authenticatedUser.user.id;

        const userAnimeList = await UserAnimeListService.getAnimeList(userId);
        const userAnimeStats = await kv.get(`userStats/${userId}`, userAnimeStatsSchema);

        if (userAnimeList == null || userAnimeStats == null) {
            return { data: null }
        }

        const dayToRecalculate = dayjs(userAnimeStats.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
        const canRecalculate = dayjs(userAnimeStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day');

        return {
            data: {
                stats: userAnimeStats.stats,
                animeList: userAnimeList.animeList as AnimeNodeWithStatus[],
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
            const canRecalculate = dayjs(userStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day');

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
} satisfies Actions;



async function calculateUserStats(cookies: Cookies,) {
    const { userId } = await getRequiredServerSession(cookies);
    const animeList = await getUserMyAnimeList(cookies);
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

async function getUserMyAnimeList(cookies: Cookies) {
    const { userId } = await getRequiredServerSession(cookies);
    const userAnimeList = await UserAnimeListService.getAnimeList(userId);

    if (userAnimeList != null) {
        return userAnimeList.animeList as AnimeNodeWithStatus[];
    }

    const animeList = await fetchMyAnimeList(cookies);
    await UserAnimeListService.setAnimeList(userId, animeList);
    return animeList;
}

async function fetchMyAnimeList(cookies: Cookies) {
    const anime: AnimeNodeWithStatus[] = [];
    const { accessToken } = await getRequiredServerSession(cookies);
    const limit = 500;
    let offset = 0;

    const malClient = new MALClient({ accessToken });

    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const res = await malClient.getUserAnimeList("@me", {
                limit,
                offset,
                fields: ["genres", "start_season", "studios", "my_list_status", "end_date", 'list_status']
            });

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

        offset += limit;
    }

    return anime;
}