<script context="module" lang="ts">
	type Query = {
		season?: AnimeSeason;
		year?: number;
		nsfw?: boolean;
	};
</script>

<script lang="ts">
	import { Alert, Checkbox, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';
	import AnimeCardGrid from '$components/AnimeListGrid.svelte';
	import AnimeSeasonSelector from '@/routes/anime/season/[year]/[season]/AnimeSeasonSelector.svelte';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { goto } from '$app/navigation';
	import { AnimeSeasonYear } from '@/lib/myanimelist/common/AnimeSeasonYear';
	import type { PageData } from './$types';
	import PageTransition from '$components/PageTransition.svelte';
	import { capitalize } from '@/lib/utils/helpers';
	import AnimeGenreDistributionGraph from '$components/graphs/AnimeGenreDistributionGraph.svelte';
	import SEO from '$components/SEO.svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';

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

	function getMaxSeason() {
		const currentSeason = AnimeHelper.getCurrentAnimeSeason();
		return AnimeSeasonYear.from(currentSeason.season, currentSeason.year).next;
	}

	function getMinSeason() {
		return AnimeSeasonYear.from('winter', 1900);
	}

	async function goToSeason(season: AnimeSeason, year: number) {
		if (season === data.season && year === data.year) {
			return;
		}

		$animeQuery.remove();
		await goto(`/anime/season/${year}/${season}`);
		await $animeQuery.refetch({ season, year, nsfw });
	}
</script>

<SEO title={'Season'} description={`Anime released on season ${data.season} ${data.year}`} />

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-6">
		<h1 class="text-white text-3xl">
			{`${capitalize(data.season)} ${data.year} anime`}
		</h1>
	</div>

	<div class="mx-2 sm:mx-10">
		<Tabs
			divider={false}
			contentClass="bg-transparent py-4"
			activeClasses="p-4 text-white bg-violet-500 rounded-t-lg"
			inactiveClasses="p-4 text-violet-300 rounded-t-lg hover:text-white hover:bg-violet-500"
			defaultClass="text-indigo-500 mt-5 flex flex-row w-full flex-wrap border-b-2 gap-2 border-b-violet-500"
		>
			<TabItem open title="Seasonal Anime">
				<div class="mt-4 mb-3 flex flex-col">
					{#key [data.season, data.year]}
						<AnimeSeasonSelector
							current={AnimeSeasonYear.from(data.season, data.year)}
							min={getMinSeason()}
							max={getMaxSeason()}
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
						<div class="mb-4">
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
			</TabItem>

			<TabItem title="Genre Distribution">
				{@const pageSize = Math.min($animeQuery.data.length, 30)}

				<AnimeGenreDistributionGraph
					maxSize={30}
					animeList={$animeQuery.data || []}
					graphTitle={`Top ${pageSize} ${capitalize(data.season)} ${
						data.year
					} Genre/Theme Distribution`}
				/>
			</TabItem>
		</Tabs>
	</div>
</PageTransition>

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
