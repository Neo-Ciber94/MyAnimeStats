import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeNodeWithStatus } from "$lib/myanimelist/common/types";
import { type CalculatedStats, calculatedStatsSchema } from "$lib/types";
import { MALClient, MalHttpError } from "$lib/myanimelist/api";
import { calculatePersonalStats } from "$lib/utils/calculatePersonalStats.server";
import { getServerSession } from "$lib/myanimelist/svelte/auth";

export const load = (async ({ cookies, platform }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw redirect(307, "/");
    }

    try {
        const data = await platform?.env.KV_STORE.get(`stats/${session.userId}`);
        const animeList = await getMyAnimeList({ cookies, platform, userId: session.userId });
        const result = calculatedStatsSchema.safeParse(data == null ? null : JSON.parse(data));

        if (result.success === true) {
            return { stats: result.data, animeList }
        }

        return { stats: null, animeList: null };
    }
    catch (err) {
        console.error(err);
        return { stats: null };
    }
}) satisfies PageServerLoad;

export const actions = {
    async calculate({ cookies, platform }) {
        const session = await getServerSession(cookies);

        if (session == null) {
            throw redirect(307, "/");
        }

        try {
            const calculatedResults = await calculateUserStats({ cookies, platform, userId: session.userId });
            const stats = calculatedStatsSchema.parse(calculatedResults.stats);
            await platform?.env.KV_STORE.put(`stats/${session.userId}`, JSON.stringify(stats));
            return { stats, animeList: calculatedResults.animeList };
        }
        catch (err) {
            console.error(err);
            throw error(400, "Failed to calculate stats");
        }
    },
} satisfies Actions;

type StatsContext = {
    cookies: Cookies,
    userId: number,
    platform: App.Platform | undefined
}

async function calculateUserStats(ctx: StatsContext) {
    const stats: CalculatedStats = {
        personal: {
            strength: 0,
            charisma: 0,
            intelligence: 0,
            vitality: 0
        }
    }

    const animeList = await getMyAnimeList(ctx);
    console.log(`🍙 ${animeList.length} anime loaded from user`);

    // Calculate stats
    stats.personal = calculatePersonalStats(animeList);
    return { stats, animeList };
}

async function getMyAnimeList(ctx: StatsContext) {
    const { cookies, platform, userId } = ctx;
    const key = `anime/${userId}`
    const json = await platform?.env.KV_STORE.get(key);
    let animeList = json == null ? undefined : JSON.parse(json) as AnimeNodeWithStatus[] | undefined;

    if (animeList == null) {
        animeList = await fetchMyAnimeList(cookies);
        await platform?.env.KV_STORE.put(key, JSON.stringify(animeList));
    }

    return animeList;
}

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