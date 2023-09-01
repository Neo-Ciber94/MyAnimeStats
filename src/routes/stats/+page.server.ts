/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeNodeWithStatus } from "$lib/myanimelist/common/types";
import type { CalculatedStats } from "$lib/types";
import { MALClient, MalHttpError } from "$lib/myanimelist/api";
import { calculatePersonalStats } from "$lib/utils/calculatePersonalStats.server";
import { getServerSession } from "$lib/myanimelist/svelte/auth";
import { UserAnimeListStats } from "./user_stats_service";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const RECALCULATE_WAIT_DAYS = 1;

export const load = (async ({ platform, locals }) => {
    if (locals.authenticatedUser == null) {
        throw redirect(307, "/");
    }

    try {
        const userStatsService = new UserAnimeListStats(platform?.env.KV_STORE!);
        const userId = locals.authenticatedUser.user.id;
        const userData = await userStatsService.getUserData(userId);

        if (userData == null) {
            return { stats: null, animeList: null, lastUpdated: null }
        }

        const dayToRecalculate = dayjs(userData.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
        const canRecalculate = dayjs(userData.lastUpdated).isSameOrAfter(dayToRecalculate, 'day');

        return {
            data: {
                stats: userData.stats,
                animeList: userData.animeList as AnimeNodeWithStatus[],
                lastUpdated: userData.lastUpdated,
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
    async calculate({ cookies, platform }) {
        const session = await getServerSession(cookies);

        if (session == null) {
            throw redirect(307, "/");
        }

        try {
            const userStatsService = new UserAnimeListStats(platform?.env.KV_STORE!);
            const calculatedResults = await calculateUserStats(cookies);
            const result = await userStatsService.saveUserData(session.userId, calculatedResults);
            const dayToRecalculate = dayjs(result.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
            const canRecalculate = dayjs(result.lastUpdated).isSameOrAfter(dayToRecalculate, 'day');

            return {
                data: {
                    stats: result.stats,
                    animeList: result.animeList as AnimeNodeWithStatus[],
                    lastUpdated: result.lastUpdated,
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
    const stats: CalculatedStats = {
        personal: {
            strength: 0,
            charisma: 0,
            intelligence: 0,
            vitality: 0
        }
    }

    const animeList = await fetchMyAnimeList(cookies);
    console.log(`🍙 ${animeList.length} anime loaded from user`);

    // Calculate stats
    stats.personal = calculatePersonalStats(animeList);
    return { stats, animeList };
}

// async function getMyAnimeList(ctx: StatsContext) {
//     const { cookies, platform, userId } = ctx;
//     const key = `anime/${userId}`
//     const json = await platform?.env.KV_STORE.get(key);
//     let animeList = json == null ? undefined : JSON.parse(json) as AnimeNodeWithStatus[] | undefined;

//     if (animeList == null) {
//         animeList = await fetchMyAnimeList(cookies);
//         await platform?.env.KV_STORE.put(key, JSON.stringify(animeList));
//     }

//     return animeList;
// }

async function fetchMyAnimeList(cookies: Cookies) {
    const anime: AnimeNodeWithStatus[] = [];
    const session = await getServerSession(cookies);

    if (session == null) {
        throw error(401, "unable to get session");
    }

    const { accessToken } = session;
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