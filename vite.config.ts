import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills as viteNodePolyfill } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		viteNodePolyfill({
			globals: {
				global: true,
			}
		})],
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		commonjsOptions: {
			exclude: ['node_modules/@puppeteer', 'node_modules/puppeteer']
		}
	}
});
