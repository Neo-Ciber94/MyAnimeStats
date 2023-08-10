<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import ScoreStatsSummary from './ScoreStatsSummary.svelte';

	export let animeList: AnimeNodeWithStatus[];
</script>

<Tabs style="pill" contentClass="bg-transparent w-full mt-4">
	<TabItem open>
		<span slot="title">Summary</span>
		<ScoreStatsSummary {animeList} />
	</TabItem>

	<TabItem>
		<span slot="title">By Year</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
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
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
	</TabItem>
</Tabs>
