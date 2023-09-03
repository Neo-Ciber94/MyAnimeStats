<script context="module" lang="ts">
	type Query = {
		q: string | undefined;
		nsfw?: boolean;
	};
</script>

<script lang="ts">
	import { Alert, Checkbox, Spinner } from 'flowbite-svelte';
	import AnimeSearchBar from './AnimeSearchBar.svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';
	import { useSearchParams } from '@/hooks/useSearchParams';
	import AnimeCardGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';

	let search: string = '';
	let nsfw = false;
	let timeout: number | undefined;
	let loadMoreMarkerElement: Element | undefined;
	let searchError: string | undefined;
	let isInit = false;

	const animeQuery = useAnimeListQuery<Query>('/api/anime/search');
	const searchParams = useSearchParams<Query>();
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	const triggerSearch = async () => {
		const s = search?.trim();

		// We need 3 or more character of an empty string for a search
		if (s && s != '' && s.length < 3) {
			return;
		}

		searchError = undefined;
		await $animeQuery.refetch($searchParams);
	};

	function handleSearch(e: CustomEvent) {
		const target = e.currentTarget as HTMLInputElement;
		search = target.value;
	}

	async function onSearchBarSearch() {
		await triggerSearch();
	}

	function refetchAnime(query: Query) {
		if (!isInit || typeof window === 'undefined') {
			return;
		}

		searchParams.set(query);

		// refetch
		clearTimeout(timeout);
		timeout = window.setTimeout(() => triggerSearch(), 500);
	}

	onMount(async () => {
		// init
		search = $searchParams.q || '';
		nsfw = $searchParams.nsfw === true;

		await triggerSearch();
		isInit = true;
	});

	onDestroy(async () => {
		clearTimeout(timeout);
		await $animeQuery.cancel();
	});

	$: {
		refetchAnime({ q: search, nsfw });
	}

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
		}
	}
</script>

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-8 mb-3 flex flex-col">
		<AnimeSearchBar
			placeholder="Search anime..."
			on:input={handleSearch}
			on:search={onSearchBarSearch}
			bind:value={search}
		/>

		{#if searchError}
			<small class="text-red-600 mt-2">{searchError}</small>
		{/if}

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
