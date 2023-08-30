<script lang="ts">
	import type { AnimeSeasonDate } from '@/lib/myanimelist/common/AnimeSeasonDate';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { createEventDispatcher } from 'svelte';
	import AnimeSeasonSelectorButton from './AnimeSeasonSelectorButton.svelte';
	import { scale } from 'svelte/transition';

	export let current: AnimeSeasonDate;

	function getSeasons() {
		return [current.prev.prev, current.prev, current.next, current.next.next];
	}

	const dispatch = createEventDispatcher<{
		click: { season: AnimeSeason; year: number };
	}>();
	const seasons = getSeasons();

	function onSeasonClick({ season, year }: AnimeSeasonDate) {
		dispatch('click', { season, year });
	}
</script>

<div class="flex flex-col md:flex-row gap-2 justify-between">
	<div class="flex flex-col xs:flex-row gap-2 justify-between w-full">
		{#each seasons.slice(0, 2) as season}
			<div in:scale class="w-full">
				<AnimeSeasonSelectorButton {season} on:click={() => onSeasonClick(season)} />
			</div>
		{/each}
	</div>

	<div class="flex flex-col xs:flex-row gap-2 justify-between w-full">
		{#each seasons.slice(2, 4) as season}
			{#key [season]}
				<div in:scale={{ start: 0.5 }} class="w-full">
					<AnimeSeasonSelectorButton {season} on:click={() => onSeasonClick(season)} />
				</div>
			{/key}
		{/each}
	</div>
</div>
