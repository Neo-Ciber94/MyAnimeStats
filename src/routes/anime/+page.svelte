<script context="module" lang="ts">
	export type ApiResponse = {
		data: AnimeObject[];
		next: string;
	};

	export type ApiError = {
		message: string;
	};
</script>

<script lang="ts">
	import { Alert, Spinner } from 'flowbite-svelte';
	import AnimeCard from '../../components/AnimeCard.svelte';
	import AnimeSearchBar from './AnimeSearchBar.svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import { onClient } from '@/lib/utils/helpers';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import { scale } from 'svelte/transition';
	import DotLoader from '$components/DotLoader.svelte';

	let search: string | undefined = '';
	let timeout: number | undefined;
	let loadMoreMarkerElement: Element | undefined;
	let searchError: string | undefined;
	let isInit = false;

	const animeQuery = useAnimeListQuery();
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	const triggerSearch = async () => {
		const s = search?.trim();

		// We need 3 or more character of an empty string for a search
		if (s && s != '' && s.length < 3) {
			return;
		}

		searchError = undefined;
		$animeQuery.refetch(search);
	};

	function handleSearch(e: CustomEvent) {
		const target = e.currentTarget as HTMLInputElement;
		search = target.value;
	}

	async function onSearchBarSearch() {
		const s = search?.trim();
		if (s && s.length >= 1 && s.length < 3) {
			searchError = 'Requires at least 3 characters';
			return;
		}

		await triggerSearch();
	}

	function refetchAnime(q: string | null | undefined) {
		if (!isInit || typeof window === 'undefined') {
			return;
		}

		const newUrl = new URL(window.location.href);
		newUrl.searchParams.set('q', q ?? '');
		const path = newUrl.toString();
		window.history.pushState({ path }, '', path);

		// refetch
		clearTimeout(timeout);
		timeout = window.setTimeout(() => triggerSearch(), 500);
	}

	onMount(async () => {
		const { searchParams } = new URL(window.location.href);
		const q = searchParams.get('q');
		if (q) {
			search = q;
		}

		await triggerSearch();
		isInit = true;
	});

	onDestroy(async () => {
		clearTimeout(timeout);
		await $animeQuery.cancel();
	});

	$: {
		refetchAnime(search);
	}

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
		}
	}
</script>

<div class="mx-2 sm:mx-10 my-8 flex flex-col">
	<AnimeSearchBar on:input={handleSearch} on:search={onSearchBarSearch} bind:value={search} />

	{#if searchError}
		<small class="text-red-600 mt-2">{searchError}</small>
	{/if}
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

	{#if $animeQuery.isLoading || !$animeQuery.data}
		<div class="w-full flex flex-row justify-center">
			<Spinner size={'12'} bg="bg-transparent" />
		</div>
	{:else if $animeQuery.data.length === 0}
		<div
			class="w-full items-center flex flex-row text-violet-500/60 text-3xl px-4 py-8 justify-center gap-4"
		>
			<InboxSolid size={'xl'} />
			<span>No anime available</span>
		</div>
	{:else}
		<div
			class="items-center mx-2 sm:mx-10 mb-4 gap-2 grid
			grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
			sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
		>
			{#each $animeQuery.data as anime, idx}
				<div class="h-full" in:scale={{ start: 0.5, delay: (idx % 10) * 50 }}>
					{#key anime.node.id}
						<AnimeCard {anime} />
					{/key}
				</div>
			{/each}
		</div>

		<div bind:this={loadMoreMarkerElement} />

		{#if $animeQuery.isFetching}
			<div class="w-full text-center">
				<DotLoader class="bg-orange-500/80" />
			</div>
		{/if}
	{/if}
</div>
