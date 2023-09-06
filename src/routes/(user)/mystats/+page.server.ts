/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeObjectWithStatus } from "$lib/myanimelist/common/types";
import type { CalculatedStats } from "$lib/types";
import { calculatePersonalStats } from "$lib/utils/calculatePersonalStats.server";
import { getRequiredServerSession, getServerSession } from "$lib/myanimelist/svelte/auth";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { UserAnimeListService } from "@/lib/services/userAnimeListService";
import { UserStatsService } from "@/lib/services/userStatsService";
import { dev } from "$app/environment";
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