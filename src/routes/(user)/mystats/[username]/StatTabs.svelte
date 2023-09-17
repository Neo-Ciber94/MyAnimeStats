<script lang="ts">
	import { Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import MyStatsSection from './MyStatsSection.svelte';
	import {
		UserSolid,
		ChartPieSolid,
		CheckCircleSolid,
		ChartLineUpSolid,
		AdjustmentsHorizontalSolid
	} from 'flowbite-svelte-icons';
	import AnimeByGenreGraph from '$components/graphs/AnimeByGenreGraph.svelte';
	import AnimeWatchedByYear from '$components/graphs/AnimeWatchedByYearGraph.svelte';
	import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
	import StatScores from './StatScores.svelte';
	import UserBadgeList from '$components/UserBadgeList.svelte';
	import { useUserBadges } from '$stores/userBadges';
	import type { CalculatedStats } from '$lib/utils/calculatePersonalStats.server';
	import { fly } from 'svelte/transition';
	import StatsExportData from './StatsDownloadData.svelte';
	import LevelIndicator from './LevelIndicator.svelte';

	export let stats: CalculatedStats;
	export let animeList: AnimeObjectWithStatus[];

	const userBadges = useUserBadges(animeList);

	let tabIndex = 0;

	function onTabClick(tab: number) {
		tabIndex = tab;
	}

	function getTransitionParams(tab: number) {
		return { duration: 300, x: 100 * Math.sign(tab - tabIndex) };
	}
</script>

<div class="w-full mt-10 p-4 flex flex-col justify-center items-center h-full overflow-hidden">
	<Tabs
		divider={true}
		style="underline"
		activeClass="text-indigo-500"
		contentClass="bg-transparent w-full pt-5"
		defaultClass="text-indigo-500 mt-5 flex flex-row justify-around w-full 
		flex-wrap border-b border-b-violet-500"
	>
		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			on:click={() => onTabClick(0)}
			open={tabIndex === 0}
		>
			<div slot="title" class="flex items-center gap-2">
				<UserSolid class="h-4 w-4 !outline-none" />
				<span>Me</span>
			</div>

			<div transition:fly={getTransitionParams(0)}>
				<div class="mt-4 mb-10">
					<h1 class="text-white text-xl mb-2">Level</h1>
					<LevelIndicator {animeList} />
				</div>
				<div
					class="h-[1px] w-10/12 mx-auto bg-gradient-to-r from-violet-500 via-violet-700 to-violet-500 rounded-full mb-10"
				/>

				<MyStatsSection {stats} />

				{#if $userBadges.loading}
					<div class="w-full p-7 flex flex-row justify-center">
						<Spinner bg="transparent" />
					</div>
				{:else if $userBadges.badges && $userBadges.user}
					<div class="mt-10 px-2 xl:px-16">
						<h1 class="text-xl mb-3">
							<span class="text-violet-500">{$userBadges.user.name}</span>
							<span class="text-white">badges</span>
						</h1>

						<div class="my-4 w-full h-[1px] rounded-lg bg-violet-700" />

						<div class="mt-2">
							<UserBadgeList user={$userBadges.user} badges={$userBadges.badges} />
						</div>
					</div>
				{/if}

				<slot name="me-footer" />
			</div>
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			on:click={() => onTabClick(1)}
			open={tabIndex === 1}
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartPieSolid class="h-4 w-4 !outline-none" />
				Genres
			</div>
			<div transition:fly={getTransitionParams(1)}>
				<AnimeByGenreGraph {animeList} />
			</div>
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			on:click={() => onTabClick(2)}
			open={tabIndex === 2}
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartLineUpSolid class="h-4 w-4 !outline-none" />
				<span>Behaviour</span>
			</div>

			<div transition:fly={getTransitionParams(2)}>
				<div class="flex flex-row justify-center">
					<h1
						class="text-white font-bold text-2xl leading-[1.7em] mb-10 border-b-2 border-b-violet-500"
					>
						Anime watched by season
					</h1>
				</div>
				<AnimeWatchedByYear {animeList} />
			</div>
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			on:click={() => onTabClick(3)}
			open={tabIndex === 3}
		>
			<div slot="title" class="flex items-center gap-2">
				<CheckCircleSolid class="h-4 w-4 !outline-none" />
				<span>Score</span>
			</div>

			<div transition:fly={getTransitionParams(3)}>
				<div class="flex flex-row justify-center">
					<h1
						class="text-white font-bold text-2xl leading-[1.7em] mb-10 border-b-2 border-b-violet-500"
					>
						Anime Scored
					</h1>
				</div>

				<StatScores {animeList} />
			</div>
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
			on:click={() => onTabClick(4)}
			open={tabIndex === 4}
		>
			<div slot="title" class="flex items-center gap-2">
				<AdjustmentsHorizontalSolid class="h-4 w-4 !outline-none" />
				<span>Advanced</span>
			</div>

			<div transition:fly={getTransitionParams(4)}>
				<div class="flex flex-col gap-2 my-4">
					<span class="text-white text-xl mb-2">Export MyList</span>
					<StatsExportData />
				</div>
			</div>
		</TabItem>
	</Tabs>
</div>
