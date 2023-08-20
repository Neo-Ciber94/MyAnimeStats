import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
	plugins: [sveltekit(), rollupNodePolyFill({ crypto: true })],
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
});
