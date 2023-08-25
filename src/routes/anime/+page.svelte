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

	let search: string | undefined;
	let timeout: number | undefined;
	let loadMoreMarkerElement: Element | undefined;
	let isInit = false;

	const animeQuery = useAnimeListQuery(() => search);
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	function handleSearch(e: CustomEvent) {
		const target = e.currentTarget as HTMLInputElement;
		search = target.value;
	}

	function queueRefetch() {
		if (typeof window === 'undefined') {
			return;
		}

		clearTimeout(timeout);
		timeout = window.setTimeout(() => $animeQuery.refetch(), 500);
		console.log('Search');
	}

	onMount(async () => {
		const { searchParams } = new URL(window.location.href);
		const q = searchParams.get('q');
		if (q) {
			search = q;
		}

		console.log({ q });
		await $animeQuery.refetch();
		isInit = true;
	});

	onDestroy(async () => {
		clearTimeout(timeout);
		await $animeQuery.cancel();
	});

	$: {
		const _ = search;
		queueRefetch();
	}

	$: {
		onClient(() => {
			if (!isInit) {
				return;
			}

			if (search != null) {
				const newUrl = new URL(window.location.href);
				newUrl.searchParams.set('q', search);
				const path = newUrl.toString();
				window.history.pushState({ path }, '', path);
			}
		});
	}

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
			console.log('load more');
		}
	}
</script>

<div class="mx-2 sm:mx-10 my-8">
	<AnimeSearchBar
		on:input={handleSearch}
		on:search={() => $animeQuery.refetch()}
		bind:value={search}
	/>
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
