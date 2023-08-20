<script lang="ts">
	import { Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import session from '$stores/session';
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
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import StatScores from './StatScores.svelte';
	import CalculateStatsButton from './CalculateStatsButton.svelte';
	import UserBadgeList from './UserBadgeList.svelte';
	import { derived } from 'svelte/store';
	import BADGES from '@/lib/badges';

	export let stats: CalculatedStats;
	export let animeList: AnimeNodeWithStatus[];

	const userBadges = derived(session, (session) => {
		const user = session.user;
		const badges = user == null ? [] : BADGES.filter((b) => b.canHaveBadge(animeList, user));
		
		return {
			loading: session.loading,
			user,
			badges
		};
	});
</script>

<div class="w-full mt-10 p-4 flex flex-col justify-center items-center h-full">
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
			open
		>
			<div slot="title" class="flex items-center gap-2">
				<UserSolid class="h-4 w-4 !outline-none" />
				<span>Me</span>
			</div>

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

			<div
				class="w-10/12 mx-auto flex flex-row justify-center mt-[10%] h-fit mb-20 border-2 border-violet-700 rounded-lg py-10"
			>
				<CalculateStatsButton>Re-Calculate Stats</CalculateStatsButton>
			</div>
		</TabItem>
		
		<!-- <TabItem
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
		</TabItem> -->
	</Tabs>
</div>
