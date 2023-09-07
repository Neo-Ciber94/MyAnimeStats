<script context="module" lang="ts">
	const querySchema = z.object({
		q: z.string().default('').catch(''),
		nsfw: z.coerce.boolean().default(false).catch(false)
	});

	type Query = z.infer<typeof querySchema>;
</script>

<script lang="ts">
	import { Alert, Checkbox, Spinner } from 'flowbite-svelte';
	import AnimeSearchBar from './AnimeSearchBar.svelte';
	import { InboxSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onDestroy, onMount } from 'svelte';
	import { useAnimeListQuery } from '@/hooks/useAnimeListQuery';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';
	import AnimeCardGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import { useZodSearchParams } from '@/hooks/useZodSearchParams';
	import { z } from 'zod';
	import type { SetValue } from '@/lib/utils/types';
	import { identity } from '@/lib/utils/helpers';
	import { browser } from '$app/environment';

	let q: string = '';
	let nsfw = false;
	let timeout: number | undefined;
	let loadMoreMarkerElement: Element | undefined;
	let searchError: string | undefined;

	const animeQuery = useAnimeListQuery<Query>('/api/anime/search');
	const searchParams = useZodSearchParams(querySchema, undefined, {
		ignoreEmptyArray: true,
		ignoreEmptyStrings: true,
		ignoreFalse: true
	});

	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	async function handleSearchAnime(query: Query) {
		const searchString = q.trim();
		searchParams.set(query);

		if (searchString != '' && searchString.length < 3) {
			return;
		}

		searchError = undefined;
		await $animeQuery.refetch(query);
	}

	function searchAnime(newQuery: SetValue<Query>, { immediate = false } = {}) {
		if (!browser) {
			return;
		}

		const query = typeof newQuery === 'function' ? newQuery({ q, nsfw }) : newQuery;
		clearTimeout(timeout);

		const delay = immediate ? 0 : 500;
		timeout = window.setTimeout(() => handleSearchAnime(query), delay);
	}

	// We only validate the input when the user click the search button
	function handleOnSearch() {
		const searchString = q.trim();
		if (searchString != '' && searchString.length < 3) {
			searchError = '3 or more characters are required';
			return;
		}

		searchAnime(identity, { immediate: true });
	}

	onMount(async () => {
		q = $searchParams.q;
		nsfw = $searchParams.nsfw;
	});

	onDestroy(async () => {
		clearTimeout(timeout);
		await $animeQuery.cancel();
	});

	$: {
		searchAnime({ q, nsfw });
	}

	$: {
		if ($canLoadMore) {
			$animeQuery.fetchNextPage();
		}
	}
</script>

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-8 mb-3 flex flex-col">
		<AnimeSearchBar placeholder="Search anime..." on:search={handleOnSearch} bind:value={q} />

		{#if searchError}
			<small class="text-red-600 mt-2">{searchError}</small>
		{/if}

		<div class="flex flex-row items-center justify-start mt-4 text-white text-xs">
			<Checkbox class="text-white" color="purple" bind:checked={nsfw}>nsfw</Checkbox>
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
			<div class="mx-2 sm:mx-10">
				<AnimeCardGrid animeList={$animeQuery.data} />
			</div>

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
