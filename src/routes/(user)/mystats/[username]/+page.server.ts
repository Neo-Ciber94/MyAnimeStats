import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { error, type Cookies, redirect } from '@sveltejs/kit';
import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
import {
	calculatePersonalStats,
	type CalculatedStats
} from '$lib/utils/calculatePersonalStats.server';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs from 'dayjs';
import { UserAnimeListService } from '@/lib/server/services/userAnimeListService';
import { UserStatsService } from '@/lib/server/services/userStatsService';
import { dev } from '$app/environment';
import { COOKIE_MY_LIST_TIMESTAMP } from '@/common/constants';
import { UserService } from '@/lib/server/services/userService';
dayjs.extend(isSameOrAfter);

const RECALCULATE_WAIT_DAYS = 1;

export const load = (async (event) => {
	if (event.locals.session == null) {
		throw redirect(307, '/');
	}

	const user = await getUserFromRequest(event);

	if (user == null) {
		throw error(404, 'User not found');
	}

	try {
		const userAnimeList = await UserAnimeListService.getUserAnimeListById(user.id);
		const userAnimeStats = await UserStatsService.getStats(user.id);

		if (userAnimeList == null || userAnimeStats == null) {
			return { data: { user } };
		}

		const dayToRecalculate = dayjs(userAnimeStats.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
		const canRecalculate =
			dayjs(userAnimeStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day') || dev;

		return {
			data: {
				user,
				stats: userAnimeStats.stats,
				animeList: userAnimeList.animeList as AnimeObjectWithStatus[],
				lastUpdated: userAnimeList.lastUpdated,
				canRecalculate
			}
		};
	} catch (err) {
		console.error(err);
		return { data: { user } };
	}
}) satisfies PageServerLoad;

export const actions = {
	async calculate(event) {
		if (event.locals.session == null) {
			throw error(401, 'Unable to determine current user');
		}

		const user = await getUserFromRequest(event);

		if (user == null) {
			throw error(404, 'User not found');
		}

		if (user.id !== event.locals.session.user.id) {
			throw error(403, 'Forbidden');
		}

		try {
			const userName = event.params.username;
			const { userStats, animeList } = await calculateUserStats({
				userId: user.id,
				cookies: event.cookies,
				userName: userName === '@me' ? undefined : userName
			});

			const dayToRecalculate = dayjs(userStats.lastUpdated).add(RECALCULATE_WAIT_DAYS, 'day');
			const canRecalculate =
				dayjs(userStats.lastUpdated).isSameOrAfter(dayToRecalculate, 'day') || dev;

			// set a timestamp cookie
			event.cookies.set(COOKIE_MY_LIST_TIMESTAMP, String(Date.now()));

			return {
				data: {
					stats: userStats.stats,
					animeList,
					lastUpdated: userStats.lastUpdated,
					canRecalculate,
					user
				}
			};
		} catch (err) {
			console.error(err);
			throw error(400, 'Failed to calculate stats');
		}
	},

	async downloadJson({ locals, setHeaders }) {
		const userId = locals.session?.user.id;

		if (!userId) {
			throw error(401);
		}

		try {
			const json = await UserAnimeListService.getUserListAsJSON(userId);
			if (json == null) {
				throw error(404);
			}

			setHeaders({ 'Content-Type': 'text/json; charset=utf-8' });
			return json;
		} catch (err) {
			console.error(err);
			throw error(500, 'Failed to get json data');
		}
	},

	async downloadCsv({ locals, setHeaders }) {
		const userId = locals.session?.user.id;

		if (!userId) {
			throw error(401);
		}

		try {
			const csv = await UserAnimeListService.getUserListAsCSV(userId);
			if (csv == null) {
				throw error(404);
			}
			setHeaders({ 'Content-Type': 'text/csv; charset=utf-8' });
			return csv;
		} catch (err) {
			console.error(err);
			throw error(500, 'Failed to get json data');
		}
	}
} satisfies Actions;

async function getUserFromRequest(event: RequestEvent) {
	const username = event.params.username;

	const user =
		username === '@me' ? event.locals.session?.user : await UserService.getUserDetails(username);

	if (user == null) {
		throw error(404);
	}

	return user;
}

async function calculateUserStats({
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
