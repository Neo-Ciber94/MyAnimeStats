import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const nodePolyfill = await loadNodePolyfill();

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfill
	],
	ssr: {
		noExternal: ['flowbite-svelte', 'flowbite-svelte-icons']
	},
	server: {
		port: 5175
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', "tests/**/*.test.{js,ts}"]
	},
	optimizeDeps: {
		include: ['./src/lib/badges/**']
	}
});

// For some reason this crash because cannot found `process/browser.js` so we only import during development
async function loadNodePolyfill() {
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
		return undefined;
	}

	const { nodePolyfills: viteNodePolyfill } = await import('vite-plugin-node-polyfills');
	return viteNodePolyfill({ globals: { global: true } });
}
