import { error, json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { parseJson } from '@/lib/utils/parseJson';
import { AnimeListService } from '@/lib/server/services/animeListService';

const authTokensSchema = z.array(z.string().min(8));

export const POST: RequestHandler = async ({ request }) => {
	if (!env.MY_ANIME_STATS_AUTH_TOKENS) {
		throw error(500, 'Unable to retrieve auth tokens');
	}

	const token = request.headers.get('my-anime-stats-auth-token');
	const allowedAuthTokens = parseJson(authTokensSchema, env.MY_ANIME_STATS_AUTH_TOKENS);

	if (allowedAuthTokens == null) {
		throw error(500, 'Unable to validate request');
	}

	if (!token || !allowedAuthTokens.includes(token)) {
		throw error(401, 'Failed to validate request');
	}

	const popularAnimeList = await AnimeListService.calculatePopularAnimeList();

	return json({
		success: true,
		data: {
			popularAnimeList
		}
	});
};
