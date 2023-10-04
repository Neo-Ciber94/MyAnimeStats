import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

const nodePolyfill = await loadNodePolyfill();

export default defineConfig({
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	server: {
		port: 5175
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.test.{js,ts}']
	},
	optimizeDeps: {
		include: ['./src/lib/badges/**']
	},
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
	},
	plugins: [
		nodePolyfill,
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
			minify: process.env.NODE_ENV !== 'development',
			// you don't need to do this if you're using generateSW strategy in your app
			strategies: 'generateSW',
			// you don't need to do this if you're using generateSW strategy in your app
			//filename: generateSW ? undefined : 'prompt-sw.ts',
			scope: '/',
			base: '/',
			//selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			selfDestroying: true,
			manifest: {
				short_name: 'MyAnimeStats',
				name: 'MyAnimeStats',
				start_url: '/',
				scope: '/',
				display: 'fullscreen',
				theme_color: '#9333ea',
				background_color: '#111827',
				icons: [
					{
						src: '/icons/my-anime-stats-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icons/my-anime-stats-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/my-anime-stats-144x144.png',
						sizes: '144x144',
						type: 'image/png'
					},
					{
						src: '/icons/my-anime-stats-96x96.png',
						sizes: '96x96',
						type: 'image/png'
					},
					{
						src: '/icons/my-anime-stats-72x72.png',
						sizes: '72x72',
						type: 'image/png'
					},
					{
						src: '/icons/my-anime-stats-48x48.png',
						sizes: '48x48',
						type: 'image/png'
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				cleanupOutdatedCaches: true,
				disableDevLogs: process.env.NODE_ENV !== 'development'
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/'
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		})
	]
});

// For some reason this crash because cannot found `process/browser.js` so we only import during development
async function loadNodePolyfill() {
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
		return undefined;
	}

	const { nodePolyfills: viteNodePolyfill } = await import('vite-plugin-node-polyfills');
	return viteNodePolyfill({ globals: { global: true, process: true } });
}
