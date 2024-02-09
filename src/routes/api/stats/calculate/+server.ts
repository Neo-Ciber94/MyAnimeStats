import { UserService } from '@/lib/server/services/userService';
import { UserStatsService } from '@/lib/server/services/userStatsService';
import { getUser } from '@animelist/auth-sveltekit/server';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const calculateSchema = z.object({ userId: z.number(), userName: z.string() });

export const POST: RequestHandler = async ({ cookies, request }) => {
	const session = await getUser(cookies);
	const result = calculateSchema.safeParse(await request.json());

	if (!result.success) {
		console.error(result);
		throw error(400, 'Failed to calculate stats');
	}

	const { data } = result;
	const userId = await UserService.getUserIdFromUsername(data.userName);

	if (userId == null || data.userId != userId) {
		console.error(`Username may be incorrect due to id mismatch: ${userId} != ${data.userId}`);
		throw error(400, `Failed to calculate stats for user '${data.userName}'`);
	}

	const isCurrentUser = session?.user.id === userId;
	const stats = await UserStatsService.calculateUserStats({
		userName: result.data.userName,
		userId,
		cookies
	});

	return json(stats, {
		headers: {
			'Cache-Control': isCurrentUser
				? 'public, max-age=3600, stale-while-revalidate=10800'
				: 'public, max-age=21600, stale-while-revalidate=43200'
		}
	});
};
