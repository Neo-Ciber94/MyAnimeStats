import { getRequiredServerSession } from '@animelist/auth-sveltekit/server';
import type { RequestHandler } from './$types';
import { UserAnimeListService } from '@/lib/server/services/userAnimeListService';
import type { AnimeApiResponse } from '@/hooks/useAnimeListQuery';
import { AnimeHelper } from '@/lib/myanimelist/common/helper';
import { AnimeListService } from '@/lib/server/services/animeListService';
import Enumerable from 'linq';
import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import ANIME_GENRES from '@/generated/animeGenres';
import { MALClient } from '@animelist/client';
import { COOKIE_ANIME_WATCHLIST } from '@/common/constants';
import dayjs from 'dayjs';

export const GET: RequestHandler = async ({ cookies, request }) => {
	const { userId } = await getRequiredServerSession(cookies);
	const { searchParams } = new URL(request.url);
	const allowNsfw = searchParams.get('nsfw') === 'true';
	const { season, year } = AnimeHelper.getCurrentAnimeSeason();
	const userAnimeList = await UserAnimeListService.getUserAnimeListById(userId);

	if (userAnimeList?.animeList == null) {
		return json({ data: [] } satisfies AnimeApiResponse);
	}

	const seasonAnimeList = await AnimeListService.getSeasonAnime({ season, year });
	const seasonAnimeToWatch = Enumerable.from(seasonAnimeList)
		.where(({ node }) => {
			if (node.start_season == null) {
				return false;
			}

			const genres = node.genres || [];
			const isNsfw = genres.some((x) => x.id === ANIME_GENRES.Hentai.ID);

			if (!allowNsfw && isNsfw) {
				return false;
			}

			return (
				node.media_type !== 'music' &&
				node.media_type !== 'unknown' &&
				node.media_type !== 'special' &&
				node.start_season.season === season &&
				node.start_season.year === year
			);
		})
		.where(({ node }) => {
			const anime = userAnimeList.animeList.find((x) => x.node.id === node.id);

			// If anime is not in the user list or is planning to watch it, we add it to the list
			return anime == null || anime?.list_status?.status === 'plan_to_watch';
		})
		.where((anime) => anime != null)
		.orderBy((anime) => anime.node.popularity)
		.toArray();

	return json({ data: seasonAnimeToWatch } satisfies AnimeApiResponse);
};

export const POST: RequestHandler = async ({ cookies, request }) => {
	const { userId, accessToken } = await getRequiredServerSession(cookies);

	const watchListSchema = z.object({
		watchList: z.array(
			z.object({
				animeId: z.number(),
				status: z.enum(['watching', 'plan_to_watch'])
			})
		)
	});

	const result = watchListSchema.safeParse(await request.json());

	if (!result.success) {
		throw error(400, 'Invalid watchlist request');
	}

	try {
		console.log('Saving watchlist', { userId, result });
		const client = new MALClient({ accessToken });

		// We update the anime list on order
		for (const record of result.data.watchList) {
			const animeId = record.animeId;
			const status = record.status;
			await client.updateMyAnimeListStatus(animeId, {
				status,
				num_watched_episodes: 1
			});

			try {
				await UserAnimeListService.updateMyUserAnimeList({
					userId,
					accessToken,
					animeId,
					data: {
						status,
						num_watched_episodes: 1
					}
				});
			} catch (err) {
				console.error(err);
			}
		}

		// We expires the cookie at the start of the next season, to show the message again
		const currentSeason = AnimeHelper.getCurrentAnimeSeason();
		const nextSeasonStartMonth = AnimeHelper.startOfNextSeason(
			currentSeason.season,
			currentSeason.year
		);
		const showNextPromptAt = dayjs()
			.month(nextSeasonStartMonth)
			.add(7, 'day') // we add 1 week because some anime don't start at the beginning of the season
			.toDate();

		cookies.set(COOKIE_ANIME_WATCHLIST, 'next_season', {
			httpOnly: false,
			path: '/',
			expires: showNextPromptAt
		});

		return json({ success: true });
	} catch (err) {
		console.error(err);

		// We wait for the next day to show the prompt again
		cookies.set(COOKIE_ANIME_WATCHLIST, '1d', {
			httpOnly: false,
			path: '/',
			maxAge: 60 * 60 * 24 // 24h
		});

		throw error(400, 'Failed to update watchlist');
	}
};
