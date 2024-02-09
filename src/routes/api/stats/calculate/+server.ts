import { UserService } from '@/lib/server/services/userService';
import { UserStatsService } from '@/lib/server/services/userStatsService';
import { getRequiredServerSession } from '@animelist/auth-sveltekit/server';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const calculateSchema = z.object({ userName: z.string() });

export const POST: RequestHandler = async ({ cookies, request }) => {
	const session = await getRequiredServerSession(cookies);
	const result = calculateSchema.safeParse(await request.json());

	if (!result.success) {
		throw error(400, 'Failed to calculate stats');
	}

	const userId = await UserService.getUserIdFromUsername(result.data.userName);

	if (userId !== session.userId) {
		throw error(400, `Failed to calculate stats for user '${result.data.userName}'`);
	}

	const stats = await UserStatsService.calculateUserStats({
		userId: session.userId,
		userName: result.data.userName,
		cookies
	});

	return json(stats, {
		headers: {
			'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
		}
	});
};
