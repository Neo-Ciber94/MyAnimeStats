<script lang="ts">
	import AnimeListGrid from '$components/AnimeListGrid.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import AnimeSearchBar from '@/routes/anime/AnimeSearchBar.svelte';
	import { Checkbox, Spinner } from 'flowbite-svelte';
	import { InboxSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import type { AnimeObjectWithStatus } from '@/lib/myanimelist/common/types';
	import ANIME_GENRES from '@/types/generated/animeGenres.generated';
	import { onMount } from 'svelte';
	import Enumerable from 'linq';

	export let data: PageServerData;

	let currentAnimeList: AnimeObjectWithStatus[] = [];
	let timeout: number | undefined;
	let nsfw = false;
	let mounted = false;
	let search = '';

	function getFilteredAnime(s: string, allowNsfw: boolean) {
		const animeList = data.data.userAnimeList?.animeList || [];
		const term = s.toLowerCase().replace(/\s/g, '');
		return Enumerable.from(animeList)
			.where(({ node }) => {
				if (allowNsfw) {
					return true;
				}

				return !node.genres.some((s) => s.id === ANIME_GENRES.Hentai.ID);
			})
			.where((anime) => anime.node.title.toLowerCase().replace(/\s/g, '').includes(term))
			.orderByDescending(({ node }) => node.my_list_status?.score)
			.toArray();
	}

	function handleSearch(s: string, allowNsfw: boolean) {
		if (typeof window === 'undefined') {
			return;
		}

		clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			currentAnimeList = getFilteredAnime(s, allowNsfw);
		}, 500);
	}

	onMount(() => {
		currentAnimeList = getFilteredAnime(search, nsfw);
		mounted = true;
	});

	$: {
		handleSearch(search, nsfw);
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
			<AnimeListGrid animeList={currentAnimeList} />
		{/if}
	</div>
</PageTransition>

<style>
	:global(body) {
		overflow-y: scroll;
	}
</style>
