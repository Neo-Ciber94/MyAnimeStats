/* eslint-disable @typescript-eslint/no-namespace */

import { KV } from "../kv";
import { userAnimeStatsSchema, type CalculatedStats } from "../types";

function getKey(userId: number) {
    return `userStats/${userId}`;
}

export namespace UserStatsService {
    export async function getStats(userId: number) {
        const kv = KV.current();
        const userAnimeStats = await kv.get(getKey(userId), userAnimeStatsSchema);
        return userAnimeStats;
    }

    export async function setStats(userId: number, stats: CalculatedStats) {
        const kv = KV.current();
        const userStats = {
            stats,
            lastUpdated: new Date()
        };
        await kv.set(getKey(userId), userAnimeStatsSchema, userStats);
        return userStats;
    }
}