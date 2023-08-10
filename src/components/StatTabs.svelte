<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import MyStatsSection from '$components/MyStatsSection.svelte';
	import {
		UserSolid,
		ChartPieSolid,
		CheckCircleSolid,
		ChartLineUpSolid
	} from 'flowbite-svelte-icons';
	import AnimeByGenreGraph from '$components/AnimeByGenreGraph.svelte';
	import type { CalculatedStats } from '$lib/types';
	import AnimeWatchedByYear from './AnimeWatchedByYear.svelte';
	import type { AnimeNode } from '$lib/myanimelist/common/types';
	import StatScores from './StatScores.svelte';

	export let stats: CalculatedStats;
	export let animeList: AnimeNode[];
</script>

<div class="w-full mt-10 p-4 flex flex-col justify-center items-center h-full">
	<Tabs
		style="underline"
		activeClass="text-indigo-500"
		contentClass="bg-transparent w-full pt-10"
		defaultClass="text-indigo-500 mt-5 flex flex-row justify-around w-full flex-wrap"
	>
		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			open
		>
			<div slot="title" class="flex items-center gap-2">
				<UserSolid class="h-4 w-4 !outline-none" />
				<span>Me</span>
			</div>

			<MyStatsSection {stats} />
		</TabItem>
		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartPieSolid class="h-4 w-4 !outline-none" />
				Genres
			</div>

			<AnimeByGenreGraph {stats} />
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartLineUpSolid class="h-4 w-4 !outline-none" />
				<span>Behaviour</span>
			</div>

			<div class="flex flex-row justify-center">
				<h1
					class="text-white font-bold text-2xl leading-[1.7em] mb-10 border-b-2 border-b-violet-500"
				>
					Anime watched by season
				</h1>
			</div>
			<AnimeWatchedByYear {animeList} />
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<CheckCircleSolid class="h-4 w-4 !outline-none" />
				<span>Score</span>
			</div>

			<div class="flex flex-row justify-center">
				<h1
					class="text-white font-bold text-2xl leading-[1.7em] mb-10 border-b-2 border-b-violet-500"
				>
					Anime Scored
				</h1>
			</div>

			<StatScores {animeList} />
		</TabItem>
	</Tabs>
</div>
