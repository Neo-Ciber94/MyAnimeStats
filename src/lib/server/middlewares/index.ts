import { dev } from '$app/environment';
import { initializeKv } from '$lib/server/kv';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createMyAnimeListFetchHandler, getUser } from '@animelist/auth-sveltekit/server';
import { SESSION_DURATION_SECONDS } from '@/common/constants';

function miniflareMiddleware(): Handle {
	return async ({ event, resolve }) => {
		if (dev) {
			const { fallBackPlatformToMiniFlareInDev } = await import('@/lib/server/miniflare');
			event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
		initializeKv(event.platform?.env.KV_STORE!);
		const res = await resolve(event);
		return res;
	};
}

function myAnimeListMiddleware(): Handle {
	return ({ event, resolve }) => {
		const myAnimeListHandler = createMyAnimeListFetchHandler({
			sessionDurationSeconds: SESSION_DURATION_SECONDS
		});
		const pathname = event.url.pathname;

		if (pathname.startsWith('/api/myanimelist')) {
			return myAnimeListHandler(event.request);
		}

		return resolve(event);
	};
}

function authMiddleware(): Handle {
	return async ({ event, resolve }) => {
		try {
			event.locals.session = await getUser(event.cookies, {
				fields: ['anime_statistics']
			});
		} catch (err) {
			console.error(err);
			event.locals.session = undefined;
		}

		return resolve(event);
	};
}

function loggerMiddleware(): Handle {
	return async ({ event, resolve }) => {
		const startMs = Date.now();
		const response = await resolve(event);
		const elapsedMs = Date.now() - startMs;

		const request = event.request;
		const method = request.method;
		const status = response.status;
		const url = request.url;
		const now = new Date().toISOString();
		const icon = status >= 400 ? '❌' : status >= 300 ? '🔁' : '✅';

		// ❌ 2023-09-01T23:13:48.386Z - GET 200 [230ms] /api/users/
		console.log(`${icon} ${now} - ${method} ${status} [${elapsedMs}ms] ${url}`);

		return response;
	};
}

export function createMiddlewareHandler() {
	return sequence(
		loggerMiddleware(),
		miniflareMiddleware(),
		authMiddleware(),
		myAnimeListMiddleware()
	);
}
