<script context="module" lang="ts">
	const querySchema = z.object({
		search: z.string().default('').catch(''),
		nsfw: z.coerce.boolean().default(false).catch(false),
		genres: z.array(z.coerce.number()).default([]).catch([]),
		order_by: animeOrderBySchema.default('my_score_desc').catch('my_score_desc').optional(),
		year: z.coerce.number().min(1900).optional().catch(undefined),
		season: animeSeasonSchema.optional().catch(undefined),
		status: watchStatusSchema.or(z.literal('needs_review')).optional().catch(undefined)
	});

	type Query = z.infer<typeof querySchema>;
</script>

<script lang="ts">
	import AnimeListGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import AnimeSearchBar from '@/routes/anime/AnimeSearchBar.svelte';
	import { Badge, Checkbox, CloseButton, Spinner } from 'flowbite-svelte';
	import { FilterOutline, InboxSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import {
		animeSeasonSchema,
		type AnimeObjectWithStatus,
		type AnimeSeason,
		type Genre,
		type WatchStatus,
		watchStatusSchema
	} from '@/lib/myanimelist/common/types';
	import ANIME_GENRES from '@/generated/animeGenres';
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
	import type { AnimeOrderBy } from './AnimeOrderBySelector.svelte';
	import AnimeOrderBySelector, { animeOrderBySchema } from './AnimeOrderBySelector.svelte';
	import FiltersDialog, { type UserWatchStatus } from './AnimeFilterDialog.svelte';
	import SEO from '$components/SEO.svelte';
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
	let isFilterOpen = false;

	// genres
	const genres = Enumerable.from(data.data.userAnimeList?.animeList || [])
		.selectMany((x) => x.node.genres as Genre[])
		.distinct((x) => x.id)
		.toArray();

	// query
	let selectedGenres: Genre[] = [];
	let search = '';
	let nsfw = false;
	let orderBy: AnimeOrderBy | undefined = undefined;
	let year: number | undefined = undefined;
	let season: AnimeSeason | undefined = undefined;
	let status: UserWatchStatus | undefined = undefined;

	const releaseYears = Enumerable.from(data.data.userAnimeList?.animeList || [])
		.select((x) => x.node.start_season!.year)
		.distinct()
		.orderByDescending((x) => x)
		.toArray();

	const formatSearch = (s: string) => {
		if (s == null) {
			return '';
		}

		return s.toLowerCase().replace(/\s/g, '');
	};

	const animeListSorter = () => {
		return (anime: AnimeObjectWithStatus) => {
			if (orderBy == null) {
				return -Number(anime.list_status.score);
			}

			switch (orderBy) {
				case 'my_score_asc':
					return anime.list_status.score;
				case 'my_score_desc':
					return -Number(anime.list_status.score);
				case 'score_asc':
					return anime.node.mean;
				case 'score_desc':
					return -Number(anime.node.mean);
				case 'rank_asc':
					return anime.node.rank;
				case 'rank_desc':
					return -Number(anime.node.rank);
				default:
					throw new Error(`Unknown order ${orderBy}`);
			}
		};
	};

	function searchAnime(newQuery: Query | ((prev: Query) => Query)) {
		let query: Query;
		if (typeof newQuery === 'function') {
			const prevQuery: Query = {
				search,
				nsfw,
				order_by: orderBy,
				genres: selectedGenres.map((x) => x.id)
			};

			query = newQuery(prevQuery);
		} else {
			query = newQuery;
		}

		const animeList = data.data.userAnimeList?.animeList || [];
		currentPages = Enumerable.from(animeList)
			.where(({ node }) => {
				if (query.nsfw) {
					return true;
				}

				const genres: Genre[] = node.genres || [];
				return !genres.some((s) => s.id === ANIME_GENRES.Hentai.ID);
			})
			.where((anime) => {
				// We group all the search terms of the anime
				const synonyms = anime.node.alternative_titles?.synonyms || [];
				const animeSearchTerms = [
					anime.node.title,
					anime.node.alternative_titles?.en || '',
					anime.node.alternative_titles?.ja || '',
					...synonyms
				].join('');

				return formatSearch(animeSearchTerms).includes(formatSearch(query.search));
			})
			.where(({ node }) => {
				const selectedGenres = query.genres || [];
				if (selectedGenres.length == 0) {
					return true;
				}

				const selectedGenreIds = node.genres.map((x) => x.id);
				return selectedGenres.every((genreId) => selectedGenreIds.includes(genreId));
			})
			.where(({ node, list_status }) => {
				if (year && node.start_season?.year !== year) {
					return false;
				}

				if (season && node.start_season?.season !== season) {
					return false;
				}

				if (status === 'needs_review') {
					// Needs user review anime is completed and is in status: watching, dropped, plan_to_watch
					const mayBeWatching =
						list_status.status === 'watching' ||
						list_status.status === 'dropped' ||
						list_status.status === 'plan_to_watch';
					return node.status === 'finished_airing' && mayBeWatching;
				} else if (status && list_status.status !== status) {
					return false;
				}

				return true;
			})
			.orderBy(animeListSorter())
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

		filterTimeout = window.setTimeout(() => searchAnime(query), 500);
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
		orderBy = $searchParams.order_by;
		year = $searchParams.year;
		season = $searchParams.season;
		status = $searchParams.status;

		const genresIds = selectedGenres.map((x) => x.id);
		searchAnime({ search, nsfw, genres: genresIds, order_by: orderBy, year, season, status });

		// loaded
		mounted = true;
	});

	// FIXME: I'm unable to declare the event handler as generic
	function handleGenreChange(event: CustomEvent<unknown[]>) {
		selectedGenres = event.detail as Genre[];
	}

	function clearFilters() {
		year = undefined;
		season = undefined;
		status = undefined;
	}

	$: filtersText = (function () {
		const filters: string[] = [];

		if (year) {
			filters.push('Year');
		}

		if (season) {
			filters.push('Season');
		}

		if (status) {
			filters.push('Status');
		}

		if (filters.length > 0) {
			return `Filtering by ${filters.join(', ')}`;
		}

		return null;
	})();

	$: {
		const genresIds = selectedGenres.map((x) => x.id);
		handleSearch({ search, nsfw, order_by: orderBy, genres: genresIds, year, season, status });
	}

	$: {
		if ($canLoadMore) {
			loadMore();
		}
	}
</script>

<SEO title="MyList" />

<PageTransition>
	<div class="mx-2 sm:mx-10 mt-8 mb-3 flex flex-col">
		<div class="flex flex-row mb-1 justify-start gap-2 items-center">
			<div class="flex flex-row gap-2 items-center">
				<button
					on:click={() => (isFilterOpen = !isFilterOpen)}
					class="text-sm text-pink-500 hover:text-pink-400 mb-2 font-medium font-mono
				flex flex-row items-center gap-1 transition duration-200 active:text-pink-800 group"
				>
					<div class="flex gap-1 rounded-lg group-hover:bg-pink-500/10 p-2">
						<FilterOutline class="outline-none" />
						<span>Filters</span>
					</div>

					<span class="text-pink-400 text-xs italic ml-2 font-extralight">{filtersText || ''}</span>
				</button>
			</div>

			{#if filtersText}
				<CloseButton
					on:click={clearFilters}
					class="ml-0 text-red-500 -mt-2 hover:bg-transparent hover:text-red-600"
				/>
			{/if}
		</div>
		<AnimeSearchBar
			placeholder="Search in list..."
			on:search={(e) => handleSearch((x) => ({ ...x, search: e.detail }))}
			bind:value={search}
		/>

		<div class="flex flex-col sm:flex-row gap-2 w-full mt-2">
			<AnimeGenreSelector {genres} bind:selected={selectedGenres} on:change={handleGenreChange} />
			<AnimeOrderBySelector bind:selected={orderBy} />
		</div>

		<div class="flex flex-row items-center justify-start mt-2 text-white text-xs">
			<Checkbox bind:checked={nsfw} class="text-white" color="purple">nsfw</Checkbox>
		</div>
	</div>

	<div class="mx-2 sm:mx-10">
		<div class="w-full mt-4">
			{#if data.data.userAnimeList?.lastUpdated}
				{@const lastUpdated = data.data.userAnimeList.lastUpdated}
				<div class="flex flex-row justify-end text-white text-xs mb-4 gap-1">
					<span class="cursor-pointer" title="Update by recalculating your stats">
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

									{#if my_list.score && my_list.status !== 'plan_to_watch'}
										<Badge rounded color="yellow" class="font-bold text-[10px]" title="My score">
											{my_list.score.toFixed(2)}
										</Badge>
									{/if}
								{/if}
							</slot>

							<slot slot="footer">
								<div class="flex flex-row justify-center gap-2">
									{#if anime.node.mean}
										<Badge
											border
											rounded
											color="purple"
											class="font-bold text-[10px]"
											title="User score"
										>
											User score
											<span class="text-gray-950 ml-1">
												{anime.node.mean.toFixed(2)}
											</span>
										</Badge>
									{/if}

									{#if anime.node.rank}
										<Badge border rounded color="pink" class="font-bold text-[10px]">
											{`Rank #${anime.node.rank}`}
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
	</div>
</PageTransition>

{#if mounted && isFilterOpen}
	<FiltersDialog
		bind:isOpen={isFilterOpen}
		years={releaseYears}
		bind:year
		bind:season
		bind:status
	/>
{/if}

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
