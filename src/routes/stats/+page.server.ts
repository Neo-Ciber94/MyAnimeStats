import { openDb } from "$lib/jsondb";
import type { Actions, PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { AnimeNode } from "$lib/myanimelist/common/types";
import { type CalculatedStats, calculatedStatsSchema } from "$lib/types";

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
    async calculate({ fetch }) {
        const db = openDb("my-stats");

        try {
            const data = await db.get('stats');
            const result = calculatedStatsSchema.safeParse(data);

            if (result.success === true) {
                return { stats: result.data }
            }

            const calculatedStats = await calculateUserStats(fetch);
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

async function calculateUserStats(fetch: typeof window.fetch): Promise<CalculatedStats> {
    const anime: AnimeNode[] = [];
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

    return stats;
}