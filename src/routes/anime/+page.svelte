<script context="module" lang="ts">
	export type ApiResponse = {
		data: AnimeNode[];
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
	import { onMount } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { getResponseError } from '@/lib/utils/getResponseError';
	import type { AnimeNode } from '@/lib/myanimelist/common/types';

	let search: string = '';
	let timeout: number | undefined;

	function handleSearch(e: CustomEvent) {
		const target = e.currentTarget as HTMLInputElement;
		search = target.value;
	}

	async function fetchAnime(q: string | null | undefined) {
		const url = new URL('/api/anime', window.location.origin);

		if (q && q.trim().length >= 3) {
			url.searchParams.set('q', q);
		}

		const res = await fetch(url);
		if (!res.ok) {
			const msg = await getResponseError(res);
			throw new Error(msg || 'Something went wrong');
		}

		const json = (await res.json()) as ApiResponse;
		return json;
	}

	const animeQuery = createQuery<ApiResponse, ApiError>({
		queryKey: ['anime'],
		queryFn: async () => await fetchAnime(search),
		enabled: false
	});

	onMount(async () => {
		await $animeQuery.refetch();
	});

	$: {
		// to trigger search
		const _ = search;

		(function () {
			if (typeof window === 'undefined') {
				return;
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = window.setTimeout(() => $animeQuery.refetch(), 500);
		})();
	}
</script>

<div class="mx-10 my-8">
	<AnimeSearchBar
		on:input={handleSearch}
		bind:value={search}
		onSearch={() => {
			$animeQuery.refetch();
		}}
	/>
</div>

<div class="w-full">
	{#if $animeQuery.error}
		<div>
			<Alert border color="red">
				<InfoCircleSolid />
				<span class="font-medium">Error</span>
				{$animeQuery.error.message}
			</Alert>
		</div>
	{/if}

	{#if $animeQuery.isLoading || !$animeQuery.data}
		<div class="w-full flex flex-row justify-center">
			<Spinner size={'16'} bg="bg-transparent" />
		</div>
	{:else if $animeQuery.data.data.length === 0}
		<div
			class="w-full items-center flex flex-row text-violet-500/60 text-3xl px-4 py-8 justify-center gap-4"
		>
			<InboxSolid size={'xl'} />
			<span>No anime available</span>
		</div>
	{:else}
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 flex-wrap gap-2 items-center mx-10 mb-4"
		>
			{#each $animeQuery.data.data as anime}
				<AnimeCard {anime} />
			{/each}
		</div>
	{/if}
</div>
