import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['flowbite-svelte']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
