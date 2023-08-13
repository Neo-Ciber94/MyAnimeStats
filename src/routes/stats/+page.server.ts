import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies, redirect } from "@sveltejs/kit";
import type { AnimeNodeWithStatus } from "$lib/myanimelist/common/types";
import { type CalculatedStats, calculatedStatsSchema } from "$lib/types";
import { Auth } from "$lib/myanimelist/auth/server";
import { db } from "$lib/db";
import { MALClient, MalHttpError } from "$lib/myanimelist/api";
import { calculatePersonalStats } from "@/lib/utils/calculatePersonalStats.server";
import { AUTH_SESSION_COOKIE, getServerSession } from "@/lib/myanimelist/svelte/auth";

export const load = (async ({ cookies }) => {
    const session = await getServerSession(cookies);

    if (session == null) {
        throw redirect(301, "/");
    }

    try {

        const data = await db.get("stats");
        const animeList = await getMyAnimeList(cookies);
        const result = calculatedStatsSchema.safeParse(data);

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
    async calculate({ cookies }) {
        try {
            const calculatedResults = await calculateUserStats(cookies);
            const stats = calculatedStatsSchema.parse(calculatedResults.stats);
            await db.put("stats", stats);
            return { stats, animeList: calculatedResults.animeList };
        }
        catch (err) {
            console.error(err);
            throw error(400, "Failed to calculate stats");
        }
    },
} satisfies Actions;

async function calculateUserStats(cookies: Cookies) {
    const stats: CalculatedStats = {
        personal: {
            strength: 0,
            charisma: 0,
            intelligence: 0,
            vitality: 0
        },
        animeByGenre: {},
        scoreByGenre: {},
        scoreByYear: {},
        storeByStudio: {},
        watchedBySeason: {},
        watchedByYear: {}
    }

    const animeList = await getMyAnimeList(cookies);
    console.log(`🍙 ${animeList.length} anime loaded from user`);

    // Calculate stats
    stats.personal = calculatePersonalStats(animeList);

    const byGenre = new Map<string, AnimeNodeWithStatus[]>();

    for (const anime of animeList) {
        const genres = anime.node.genres || [];
        for (const genre of genres) {
            const grouping = byGenre.get(genre.name) || [];
            grouping.push(anime);
            byGenre.set(genre.name, grouping);
        }
    }

    for (const [genre, totalAnime] of byGenre.entries()) {
        stats.animeByGenre[genre] = totalAnime.length;
    }

    return { stats, animeList };
}

async function getMyAnimeList(cookies: Cookies) {
    let animeList = await db.get("anime") as AnimeNodeWithStatus[] | undefined;

    if (animeList == null) {
        animeList = await fetchMyAnimeList(cookies);
        await db.put("anime", animeList);
    }

    return animeList;
}

async function fetchMyAnimeList(cookies: Cookies) {
    const anime: AnimeNodeWithStatus[] = [];
    const refreshToken = cookies.get(AUTH_SESSION_COOKIE);

    if (refreshToken == null) {
        throw error(401, "unable to get session");
    }

    const { access_token: accessToken } = await Auth.refreshToken({ refreshToken });

    const limit = 500;
    let offset = 0;

    const malClient = new MALClient({ accessToken });

    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const res = await malClient.getUserAnimeList("@me", {
                limit,
                offset,
                fields: ["genres", "start_season", "studios", "my_list_status", "end_date", "list_status"]
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