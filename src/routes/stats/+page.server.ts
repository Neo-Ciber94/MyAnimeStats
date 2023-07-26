import { openDb } from "$lib/jsondb";
import { z } from "zod";
import type { Actions } from "./$types";
import { error } from "@sveltejs/kit";
import type { AnimeNode } from "$lib/myanimelist/common/types";
import { type CalculatedStats, calculatedStatsSchema } from "$lib/types";

export const actions = {
    async calculate({ fetch }) {
        const db = openDb("my-stats");

        try {
            const data = await db.get('stats');

            let stats: CalculatedStats;
            if (data == null) {
                stats = await calculateStats(fetch);
            }

            stats = calculatedStatsSchema.parse(data);
            await db.set("stats", stats);
            return { stats };
        }
        catch (err) {
            console.error(err);
            throw error(400, "Failed to calculate stats");
        }
    }
} satisfies Actions;

async function calculateStats(fetch: typeof window.fetch): Promise<CalculatedStats> {
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