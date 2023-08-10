<script lang="ts">
	import type { AnimeNode } from '$lib/myanimelist/common/types';
	import { Tabs, TabItem } from 'flowbite-svelte';

	export let animeList: AnimeNode[];
</script>

<Tabs style="pill">
	<TabItem open>
		<span slot="title">Summary</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
	</TabItem>

	<TabItem>
		<span slot="title">By Year</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
			et dolore magna aliqua.
		</p>
	</TabItem>

	<TabItem>
		<span slot="title">By Genre</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
	</TabItem>

	<TabItem>
		<span slot="title">By Studio</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
			et dolore magna aliqua.
		</p>
	</TabItem>
</Tabs>
