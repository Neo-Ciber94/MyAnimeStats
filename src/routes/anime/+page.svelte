<script context="module" lang="ts">
	type Query = {
		q: string | undefined;
		nsfw?: boolean;
	};
</script>

<script lang="ts">
	import { Alert, Checkbox, Spinner } from 'flowbite-svelte';
	import AnimeCard from '../../components/AnimeCard.svelte';
	import AnimeSearchBar from './AnimeSearchBar.svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/DotLoader.svelte';

	let search: string = '';
	let allowNsfw = false;
	let timeout: number | undefined;
	let loadMoreMarkerElement: Element | undefined;
	let searchError: string | undefined;
	let isInit = false;

	const animeQuery = useAnimeListQuery<Query>('/api/anime/search');
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	const triggerSearch = async () => {
		const s = search?.trim();

		// We need 3 or more character of an empty string for a search
		if (s && s != '' && s.length < 3) {
			return;
		}

		searchError = undefined;
		await $animeQuery.refetch({ q: search, nsfw: allowNsfw });
	};

	function handleSearch(e: CustomEvent) {
		const target = e.currentTarget as HTMLInputElement;
		search = target.value;
	}

	async function onSearchBarSearch() {
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
		let _ = allowNsfw;
		refetchAnime(search);
	}

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
		}
	}
</script>

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
		<Checkbox bind:checked={allowNsfw} class="text-white" color="purple">nsfw</Checkbox>
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

	{#if $animeQuery.isLoading || !$animeQuery.data}
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
		<div
			class="items-center mx-2 sm:mx-10 mb-4 gap-2 grid
			grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
			sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
		>
			{#each $animeQuery.data as anime, idx}
				{#key anime.node.id}
					<div
						class="fade-in h-full opacity-0 scale-50"
						style="--animation-delay: {(idx % 10) * 50}ms"
					>
						<AnimeCard {anime} />
					</div>
				{/key}
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

<style lang="postcss">
	:global(body) {
		overflow-y: scroll;
	}

	.fade-in {
		animation: fadeIn forwards 300ms ease-out;
		animation-delay: var(--animation-delay);
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
