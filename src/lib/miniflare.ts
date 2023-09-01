import { Miniflare, Log, LogLevel } from 'miniflare';
import { dev } from '$app/environment';

export const fallBackPlatformToMiniFlareInDev = async (_platform: App.Platform | undefined) => {
	if (!dev || _platform) {
		return _platform;
	}

	// https://github.com/sveltejs/kit/issues/2966#issuecomment-1251898659
	const mf = new Miniflare({
		log: new Log(LogLevel.INFO),
		kvPersist: './private/kv-data',
		kvNamespaces: ['KV_STORE'],

		script: `
		addEventListener("fetch", (event) => {
			event.waitUntil(Promise.resolve(event.request.url));
			event.respondWith(new Response(event.request.headers.get("X-Message")));
		});
		addEventListener("scheduled", (event) => {
			event.waitUntil(Promise.resolve(event.scheduledTime));
		});
		`
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const env: any = await mf.getBindings();

	const platform: App.Platform = { env };

	return platform;
};