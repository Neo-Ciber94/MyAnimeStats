<script lang="ts">
	import AnimeListGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import AnimeSearchBar from '@/routes/anime/AnimeSearchBar.svelte';
	import { Badge, Checkbox, Spinner } from 'flowbite-svelte';
	import { InboxSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import type { AnimeObjectWithStatus } from '@/lib/myanimelist/common/types';
	import ANIME_GENRES from '@/types/generated/animeGenres.generated';
	import { onMount } from 'svelte';
	import Enumerable from 'linq';
	import AnimeCard from '$components/AnimeCard.svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import DotLoader from '$components/loaders/DotLoader.svelte';

	export let data: PageServerData;
	const pageSize = 40;

	let loadMoreMarkerElement: HTMLDivElement;
	$: canLoadMore = useInterceptionObserver(loadMoreMarkerElement);

	let currentPages: AnimeObjectWithStatus[] = [];
	let currentAnimeList: AnimeObjectWithStatus[] = [];

	let filterTimeout: number | undefined;
	let loadingTimeout: number | undefined;
	let nsfw = false;
	let mounted = false;
	let search = '';
	let isLoadingMore = false;

	function filterAllAnime(s: string, allowNsfw: boolean) {
		const animeList = data.data.userAnimeList?.animeList || [];
		const term = s.toLowerCase().replace(/\s/g, '');
		currentPages = Enumerable.from(animeList)
			.where(({ node }) => {
				if (allowNsfw) {
					return true;
				}

				return !node.genres.some((s) => s.id === ANIME_GENRES.Hentai.ID);
			})
			.where((anime) => anime.node.title.toLowerCase().replace(/\s/g, '').includes(term))
			.orderByDescending(({ node }) => node.my_list_status?.score)
			.toArray();

		currentAnimeList = currentPages.slice(0, pageSize);
	}

	function handleSearch(s: string, allowNsfw: boolean) {
		if (typeof window === 'undefined') {
			return;
		}

		clearTimeout(filterTimeout);
		clearTimeout(loadingTimeout);

		filterTimeout = window.setTimeout(() => filterAllAnime(s, allowNsfw), 500);
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
		filterAllAnime(search, nsfw);
		mounted = true;
	});

	$: {
		handleSearch(search, nsfw);
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
			placeholder="Search anime..."
			on:search={(e) => handleSearch(e.detail, nsfw)}
			bind:value={search}
		/>
		<div class="flex flex-row items-center justify-start mt-4 text-white text-xs">
			<Checkbox bind:checked={nsfw} class="text-white" color="purple">nsfw</Checkbox>
		</div>
	</div>

	<div class="w-full mt-8">
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
