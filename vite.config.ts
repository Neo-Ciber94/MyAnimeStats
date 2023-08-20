import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const nodePolyfillsPlugin = nodePolyfills({
	globals: {
		global: true
	}
});

export default defineConfig({
	plugins: [sveltekit(), nodePolyfillsPlugin],
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
});
