import { MALClient } from '@animelist/client';
import type { PageServerLoad } from './$types';
import type { AiringStatus } from '@/lib/myanimelist/common/types';
import ANIME_GENRES from '@/generated/animeGenres';
import { shuffleArray } from '@/lib/utils/helpers';
import { MAL_CLIENT_ID } from '$env/static/private';
import { AnimeHelper } from '@/lib/myanimelist/common/helper';

const ANIME_LIMIT = 50;

export const load: PageServerLoad = async (event) => {
	const accessToken = event.locals.session?.accessToken;

	// Do not use Promise.all(), this is intentional, MyAnimeList API throw an error if we do too much requests in parallel
	const suggestedAnimeList = await getSuggestedAnimeList({ limit: ANIME_LIMIT, accessToken });
	const seasonalAnimeList = await getCurrentSeasonAnimeList({ limit: ANIME_LIMIT });
	const mostPopularAnimeList = await getMostPopularAnimeList({ limit: ANIME_LIMIT });
	const upcomingAnimeList = await getUpcomingAnimeList({ limit: 100 });

	return { seasonalAnimeList, suggestedAnimeList, mostPopularAnimeList, upcomingAnimeList };
};

async function getCurrentSeasonAnimeList({ limit }: { limit: number }) {
	const malClient = new MALClient({
		clientId: MAL_CLIENT_ID
	});

	try {
		const { season, year } = AnimeHelper.getCurrentAnimeSeason();
		const result = await malClient.getSeasonalAnime({
			season,
			year,
			limit,
			fields: ['start_season', 'status', 'start_date', 'genres', 'broadcast'],
			sort: 'anime_num_list_users',
			nsfw: true
		});

		const AVAILABLE_STATUSES = ['currently_airing', 'finished_airing'] as AiringStatus[];

		const animeList = result.data.filter(({ node }) => {
			if (node.start_season == null) {
				return false;
			}

			const genres = node.genres || [];
			return (
				node.start_season.season == season &&
				node.start_date != null &&
				AVAILABLE_STATUSES.includes(node.status) &&
				node.broadcast?.start_time != null &&
				!genres.some((x) => x.id === ANIME_GENRES.Hentai.ID)
			);
		});

		return animeList;
	} catch (err) {
		console.error('Failed to load current season anime', err);
		return [];
	}
}

async function getSuggestedAnimeList({
	limit,
	accessToken
}: {
	limit: number;
	accessToken?: string;
}) {
	if (accessToken == null) {
		return null;
	}

	const malClient = new MALClient({ accessToken });

	try {
		const suggestions = await malClient.getSuggestedAnime({
			limit,
			fields: ['start_date', 'rank']
		});

		const data = shuffleArray(suggestions.data);
		return data;
	} catch (err) {
		console.error('Failed to load anime suggestions', err);
		return [];
	}
}

async function getMostPopularAnimeList({ limit }: { limit: number }) {
	const malClient = new MALClient({ clientId: MAL_CLIENT_ID });

	try {
		const result = await malClient.getAnimeRanking({
			limit,
			ranking_type: 'tv'
		});

		const data = result.data;
		return data;
	} catch (err) {
		console.error('Failed to load most popular anime', err);
		return [];
	}
}

async function getUpcomingAnimeList({ limit }: { limit: number }) {
	const malClient = new MALClient({ clientId: MAL_CLIENT_ID });
	const currentSeason = AnimeHelper.getCurrentAnimeSeason();
	const { season, year } = AnimeHelper.getNextAnimeSeason(currentSeason.season, currentSeason.year);

	try {
		const result = await malClient.getSeasonalAnime({
			limit,
			season,
			year,
			fields: ['status', 'num_list_users', 'popularity']
		});

		const notYetAired = result.data.filter((anime) => anime.node.status === 'not_yet_aired');
		const data = shuffleArray(notYetAired);
		return data;
	} catch (err) {
		console.error('Failed to laod upcoming anime', err);
		return [];
	}
}
