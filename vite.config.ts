import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

const nodePolyfill = { ...rollupNodePolyFill({ crypto: true }), name: 'rollup-plugin-node-builtins' }

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {

	}
});
