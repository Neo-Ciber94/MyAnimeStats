import { openDb } from "$lib/jsondb";
import type { Actions, PageServerLoad } from "./$types";
import { error, type Cookies } from "@sveltejs/kit";
import type { AnimeApiResponse, AnimeNode } from "$lib/myanimelist/common/types";
import { type CalculatedStats, calculatedStatsSchema } from "$lib/types";
import { MyAnimeListAuth } from "$lib/myanimelist/auth/server";

export const load = (async () => {
    const db = openDb("my-stats");

    try {
        const data = await db.get('stats');
        const result = calculatedStatsSchema.safeParse(data);

        if (result.success === true) {
            return { stats: result.data }
        }

        return { stats: null };
    }
    catch (err) {
        console.error(err);
        return { stats: null };
    }
}) satisfies PageServerLoad;

export const actions = {
    async calculate({ fetch, cookies }) {
        const db = openDb("my-stats");

        try {
            const data = await db.get('stats');
            const result = calculatedStatsSchema.safeParse(data);

            if (result.success === true) {
                return { stats: result.data }
            }

            const calculatedStats = await calculateUserStats(fetch, cookies);
            const stats = calculatedStatsSchema.parse(calculatedStats);
            await db.set("stats", stats);
            return { stats };
        }
        catch (err) {
            console.error(err);
            throw error(400, "Failed to calculate stats");
        }
    }
} satisfies Actions;

async function calculateUserStats(fetch: typeof window.fetch, cookies: Cookies): Promise<CalculatedStats> {
    const stats: CalculatedStats = {
        personal: {
            strength: 80,
            charisma: 80,
            intelligence: 80,
            vitality: 80
        },
        animeByGenre: {},
        scoreByGenre: {},
        scoreByYear: {},
        storeByStudio: {},
        watchedBySeason: {},
        watchedByYear: {}
    }

    const db = openDb("myanime");
    let animeList = await db.get("anime") as AnimeNode[] | undefined;

    if (animeList == null) {
        animeList = await fetchMyAnimeList(fetch, cookies);
        await db.set("anime", animeList);
    }

    console.log(`🍙 ${animeList.length} anime loaded from user`);

    // Calculate stats
    const byGenre = new Map<string, AnimeNode[]>();

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

    console.log(stats);

    return stats;
}

function groupBy<T, K>(items: T[], keySelector: (item: T) => K): Map<K, T[]> {
    const groups = new Map();

    for (const item of items) {
        const key = keySelector(item);
        const grouping = groups.get(key) || [];
        grouping.push(item);
        groups.set(key, grouping);
    }

    return groups;
}

async function fetchMyAnimeList(fetch: typeof window.fetch, cookies: Cookies) {
    const anime: AnimeNode[] = [];
    const refreshToken = cookies.get("auth-session");

    if (refreshToken == null) {
        throw error(401, "unable to get session");
    }

    const { access_token: accessToken } = await MyAnimeListAuth.refreshToken({ refreshToken });

    const limit = 500;
    let offset = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const url = new URL("https://api.myanimelist.net/v2/users/@me/animelist");
        url.searchParams.set("fields", "genres,start_season,studios,my_list_status");
        url.searchParams.set("limit", limit.toString());
        url.searchParams.set("offset", offset.toString());

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const msg = await res.text();
            console.error(msg);
            throw error(res.status, msg ?? "failed to load myanimelist");
        }

        const json = await res.json() as AnimeApiResponse;
        const data = json.data;
        anime.push(...data);

        if (json.paging.next == null) {
            break;
        }

        offset += limit;
    }

    return anime;
}