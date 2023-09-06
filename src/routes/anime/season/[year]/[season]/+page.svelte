<script context="module" lang="ts">
	type Query = {
		season?: AnimeSeason;
		year?: number;
		nsfw?: boolean;
	};
</script>

<script lang="ts">
	import { Alert, Checkbox, Spinner } from 'flowbite-svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';
	import AnimeCardGrid from '$components/AnimeListGrid.svelte';
	import AnimeSeasonSelector from '$components/AnimeSeasonSelector.svelte';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { goto } from '$app/navigation';
	import { AnimeSeasonDate } from '@/lib/myanimelist/common/AnimeSeasonDate';
	import type { PageData } from './$types';
	import PageTransition from '$components/PageTransition.svelte';
	import { capitalize } from '@/lib/utils/helpers';

	export let data: PageData;

	let nsfw = false;
	let loadMoreMarkerElement: Element | undefined;
	const animeQuery = useAnimeListQuery<Query>('/api/anime/season');
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	onMount(async () => {
		await $animeQuery.refetch({ season: data.season, year: data.year, nsfw });
	});

	onDestroy(async () => {
		await $animeQuery.cancel();
	});

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
		}
	}

	async function goToSeason(season: AnimeSeason, year: number) {
		$animeQuery.remove();
		await goto(`/anime/season/${year}/${season}`);
		await $animeQuery.refetch({ season, year, nsfw });
	}
</script>

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-6">
		<h1 class="text-white text-3xl">
			{`${capitalize(data.season)} ${data.year} anime`}
		</h1>
	</div>

	<div class="mx-2 sm:mx-10 mt-4 mb-3 flex flex-col">
		{#key [data.season, data.year]}
			<AnimeSeasonSelector
				current={AnimeSeasonDate.from(data.season, data.year)}
				on:click={(e) => {
					const { season, year } = e.detail;
					goToSeason(season, year);
				}}
			/>
		{/key}

		<div class="flex flex-row items-center justify-start mt-4 text-white text-xs">
			<Checkbox bind:checked={nsfw} class="text-white" color="purple">nsfw</Checkbox>
		</div>
	</div>

	<div class="w-full">
		{#if $animeQuery.isError && $animeQuery.error}
			<div class="mb-4 mx-2 sm:mx-10">
				<Alert dismissable border color="red">
					<InfoCircleSolid />
					<span class="font-medium">Error</span>
					{$animeQuery.error.message}
				</Alert>
			</div>
		{/if}

		{#if $animeQuery.isLoading}
			<div class="w-full flex flex-row justify-center">
				<Spinner size={'12'} bg="bg-transparent" />
			</div>
		{:else if $animeQuery.data.length === 0}
			<div
				class="w-full items-center flex flex-row text-violet-500/60 text-3xl px-4 py-8 justify-center gap-4"
			>
				<InboxSolid size={'xl'} />
				<span>No anime found</span>
			</div>
		{:else}
			<AnimeCardGrid animeList={$animeQuery.data} />

			<div bind:this={loadMoreMarkerElement} />

			{#if $animeQuery.isFetching}
				<div class="w-full text-center">
					<DotLoader class="bg-orange-500/80" />
				</div>
			{/if}
		{/if}
	</div>
</PageTransition>

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
