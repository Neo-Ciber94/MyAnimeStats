/* eslint-disable @typescript-eslint/no-namespace */

import { z } from 'zod';
import { KV } from '../kv';
import {
	calculatePersonalStats,
	calculatedStatsSchema,
	type CalculatedStats
} from '$lib/utils/calculatePersonalStats.server';
import { UserAnimeListService } from './userAnimeListService';
import type { Cookies } from '@sveltejs/kit';

export const userAnimeStatsSchema = z.object({
	lastUpdated: z.coerce.date(),
	stats: calculatedStatsSchema
});

export type UserAnimeStats = z.infer<typeof userAnimeStatsSchema>;

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

	export async function calculateUserStats({
		userId,
		cookies,
		userName
	}: {
		userId: number;
		userName?: string;
		cookies: Cookies;
	}) {
		const animeList =
			userName != null
				? await UserAnimeListService.fetchUserAnimeListByName(userName, cookies)
				: await UserAnimeListService.fetchUserAnimeListById(userId, cookies);

		console.log(`🍙 ${animeList.length} anime loaded from user ${userId}`);

		let userStats = await UserStatsService.getStats(userId);

		if (userStats) {
			return {
				userStats,
				animeList
			};
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
}

export type UserStats = Awaited<ReturnType<typeof UserStatsService.calculateUserStats>>;
