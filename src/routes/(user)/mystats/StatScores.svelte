<script lang="ts">
	import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import ScoreStatsSummary from './ScoreStatsSummary.svelte';
	import ScoreByTime from '$components/graphs/ScoreByTimeGraph.svelte';
	import ScoreByGenre from '$components/graphs/ScoreByGenreGraph.svelte';
	import ScoreByAnimeStudio from '$components/graphs/ScoreByAnimeStudioGraph.svelte';

	export let animeList: AnimeObjectWithStatus[];
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
		<ScoreByAnimeStudio {animeList} />
	</TabItem>
</Tabs>
