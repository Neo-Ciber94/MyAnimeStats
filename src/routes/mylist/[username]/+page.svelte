<script context="module" lang="ts">
	const querySchema = z.object({
		search: z.string().default(''),
		nsfw: z.coerce.boolean().default(false),
		genres: z.array(z.coerce.number()).default([])
	});

	type Query = z.infer<typeof querySchema>;
</script>

<script lang="ts">
	import AnimeListGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import AnimeSearchBar from '@/routes/anime/AnimeSearchBar.svelte';
	import { Badge, Checkbox, Spinner } from 'flowbite-svelte';
	import { InboxSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import type { AnimeObjectWithStatus, Genre } from '@/lib/myanimelist/common/types';
	import ANIME_GENRES from '@/types/generated/animeGenres.generated';
	import { onMount } from 'svelte';
	import Enumerable from 'linq';
	import AnimeCard from '$components/AnimeCard.svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import AnimeGenreSelector from './AnimeGenreSelector.svelte';
	import { z } from 'zod';
	import { useZodSearchParams } from '@/hooks/useZodSearchParams';
	dayjs.extend(localizedFormat);

	export let data: PageServerData;
	const pageSize = 40;

	let loadMoreMarkerElement: HTMLDivElement;
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);
	
	const searchParams = useZodSearchParams(querySchema, undefined, {
		ignoreEmptyArray: true,
		ignoreEmptyStrings: true,
		ignoreFalse: true
	});

	let currentPages: AnimeObjectWithStatus[] = [];
	let currentAnimeList: AnimeObjectWithStatus[] = [];
	let filterTimeout: number | undefined;
	let loadingTimeout: number | undefined;
	let mounted = false;
	let isLoadingMore = false;

	// genres
	const genres = Enumerable.from(data.data.userAnimeList?.animeList || [])
		.selectMany((x) => x.node.genres)
		.distinct((x) => x.id)
		.toArray();

	// query
	let selectedGenres: Genre[] = [];
	let search = '';
	let nsfw = false;

	function filterAllAnime(newQuery: Query | ((prev: Query) => Query)) {
		let query: Query;
		if (typeof newQuery === 'function') {
			const prevQuery: Query = {
				search,
				nsfw,
				genres: selectedGenres.map((x) => x.id)
			};

			query = newQuery(prevQuery);
		} else {
			query = newQuery;
		}

		const animeList = data.data.userAnimeList?.animeList || [];
		const term = query.search.toLowerCase().replace(/\s/g, '');
		currentPages = Enumerable.from(animeList)
			.where(({ node }) => {
				if (query.nsfw) {
					return true;
				}

				return !node.genres.some((s) => s.id === ANIME_GENRES.Hentai.ID);
			})
			.where((anime) => anime.node.title.toLowerCase().replace(/\s/g, '').includes(term))
			.where(({ node }) => {
				const selectedGenres = query.genres || [];
				if (selectedGenres.length == 0) {
					return true;
				}

				const selectedGenreIds = node.genres.map((x) => x.id);
				return selectedGenres.every((genreId) => selectedGenreIds.includes(genreId));
			})
			.orderByDescending(({ node }) => node.my_list_status?.score)
			.toArray();

		currentAnimeList = currentPages.slice(0, pageSize);
		searchParams.set(query);
	}

	function handleSearch(query: Query | ((prev: Query) => Query)) {
		if (typeof window === 'undefined') {
			return;
		}

		clearTimeout(filterTimeout);
		clearTimeout(loadingTimeout);

		filterTimeout = window.setTimeout(() => filterAllAnime(query), 500);
	}

	function loadMore() {
		if (currentAnimeList.length >= currentPages.length) {
			return;
		}

		clearTimeout(loadingTimeout);
		isLoadingMore = true;
		window.setTimeout(() => {
			const size = Math.min(currentAnimeList.length + pageSize, currentPages.length);
			currentAnimeList = currentPages.slice(0, size);
			isLoadingMore = false;
		}, 300);
	}

	onMount(() => {
		search = $searchParams.search || '';
		nsfw = $searchParams.nsfw;
		selectedGenres = genres.filter((x) => $searchParams.genres.includes(x.id));

		const genresIds = selectedGenres.map((x) => x.id);
		filterAllAnime({ search, nsfw, genres: genresIds });

		// loaded
		mounted = true;
	});

	// FIXME: I'm unable to declare the event handler as generic
	function handleGenreChange(event: CustomEvent<unknown[]>) {
		selectedGenres = event.detail as Genre[];
	}

	$: {
		const genresIds = selectedGenres.map((x) => x.id);
		handleSearch({ search, nsfw, genres: genresIds });
	}

	$: {
		if ($canLoadMore) {
			loadMore();
		}
	}
</script>

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-8 mb-3 flex flex-col">
		<AnimeSearchBar
			placeholder="Search in list..."
			on:search={(e) => handleSearch((x) => ({ ...x, search: e.detail }))}
			bind:value={search}
		/>

		<div class="flex flex-row gap-2 w-full mt-2">
			<AnimeGenreSelector {genres} bind:selected={selectedGenres} on:change={handleGenreChange} />
		</div>

		<div class="flex flex-row items-center justify-start mt-4 text-white text-xs">
			<Checkbox bind:checked={nsfw} class="text-white" color="purple">nsfw</Checkbox>
		</div>
	</div>

	<div class="w-full mt-4">
		{#if data.data.userAnimeList?.lastUpdated}
			{@const lastUpdated = data.data.userAnimeList.lastUpdated}
			<div class="flex flex-row justify-end text-white text-xs mx-2 sm:mx-10 mb-4 gap-1">
				<span class="cursor-pointer">
					Last updated <span class="text-pink-500"> {dayjs(lastUpdated).format('LL')}</span>
				</span>
			</div>
		{/if}

		{#if !mounted}
			<div class="w-full flex flex-row justify-center">
				<Spinner size={'12'} bg="bg-transparent" />
			</div>
		{:else if data.data == null}
			<div
				class="w-full items-center flex flex-row text-violet-500/60 text-2xl px-4 py-8 justify-center gap-4"
			>
				<InboxSolid size={'xl'} />
				<span>Currently is not possible cannot watch anime list from other users</span>
			</div>
		{:else if data.data.userAnimeList == null}
			<div
				class="w-full items-center flex flex-row text-violet-500/60 text-3xl px-4 py-8 justify-center gap-4"
			>
				<InboxSolid size={'xl'} />
				<span>Calculate your stats</span>
			</div>
		{:else if currentAnimeList.length === 0}
			<div
				class="w-full items-center flex flex-row text-violet-500/60 text-3xl px-4 py-8 justify-center gap-4"
			>
				<InboxSolid size={'xl'} />
				<span>No anime found</span>
			</div>
		{:else}
			<AnimeListGrid animeList={currentAnimeList}>
				<slot slot="anime" let:anime>
					<AnimeCard {anime}>
						<slot slot="header">
							{#if anime.node.my_list_status}
								{@const my_list = anime.node.my_list_status}

								{#if my_list.status}
									<Badge rounded color="dark" class="font-bold text-[10px]">
										{AnimeHelper.watchStatusToString(my_list.status)}
									</Badge>
								{/if}

								{#if my_list.score}
									<Badge rounded color="yellow" class="font-bold text-[10px]" title="My score">
										{my_list.score.toFixed(2)}
									</Badge>
								{/if}
							{/if}
						</slot>

						<slot slot="footer">
							<div class="flex flex-row justify-center">
								{#if anime.node.mean}
									<Badge
										border
										rounded
										color="purple"
										class="font-bold text-[10px]"
										title="User score"
									>
										User score
										<span class="text-gray-900 ml-1">
											{anime.node.mean.toFixed(2)}
										</span>
									</Badge>
								{/if}
							</div>
						</slot>
					</AnimeCard>
				</slot>
			</AnimeListGrid>

			<div bind:this={loadMoreMarkerElement} />

			{#if isLoadingMore}
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
