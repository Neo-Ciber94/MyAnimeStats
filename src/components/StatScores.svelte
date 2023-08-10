<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import ScoreStatsSummary from './ScoreStatsSummary.svelte';
	import ScoreByTime from './ScoreByTime.svelte';
	import ScoreByGenre from './ScoreByGenre.svelte';

	export let animeList: AnimeNodeWithStatus[];
</script>

<Tabs style="pill" contentClass="bg-transparent w-full mt-4">
	<TabItem
		open
		inactiveClasses="text-orange-500 py-3 px-4 hover:bg-white rounded-md hover:text-black"
	>
		<span slot="title">Summary</span>
		<ScoreStatsSummary {animeList} />
	</TabItem>

	<TabItem inactiveClasses="text-orange-500 py-3 px-4 hover:bg-white rounded-md hover:text-black">
		<span slot="title">Over Time</span>
		<ScoreByTime {animeList} />
	</TabItem>

	<TabItem inactiveClasses="text-orange-500 py-3 px-4 hover:bg-white rounded-md hover:text-black">
		<span slot="title">By Genre</span>
		<ScoreByGenre {animeList} />
	</TabItem>

	<TabItem inactiveClasses="text-orange-500 py-3 px-4 hover:bg-white rounded-md hover:text-black">
		<span slot="title">By Studio</span>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
	</TabItem>
</Tabs>
