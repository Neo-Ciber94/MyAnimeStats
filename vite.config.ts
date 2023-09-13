import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	server: {
		port: 5175
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', "tests/**/*.test.{js,ts}"],
	},
	optimizeDeps: {
		include: ['./src/lib/badges/**'],
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
			},
		},
	},
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			// you don't need to do this if you're using generateSW strategy in your app
			strategies: 'generateSW',
			// you don't need to do this if you're using generateSW strategy in your app
			//filename: generateSW ? undefined : 'prompt-sw.ts',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				short_name: 'MyAnimeStats',
				name: 'MyAnimeStats',
				start_url: '/',
				scope: '/',
				display: 'fullscreen',
				theme_color: "#9333ea",
				background_color: "#111827",
				icons: [
					{
						src: '/icons/my-anime-stats-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/icons/my-anime-stats-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/icons/my-anime-stats-144x144.png',
						sizes: '144x144',
						type: 'image/png',
					},
					{
						src: '/icons/my-anime-stats-96x96.png',
						sizes: '96x96',
						type: 'image/png',
					},
					{
						src: '/icons/my-anime-stats-72x72.png',
						sizes: '72x72',
						type: 'image/png',
					},
					{
						src: '/icons/my-anime-stats-48x48.png',
						sizes: '48x48',
						type: 'image/png',
					},
				],
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/',
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		}),
	],
});
