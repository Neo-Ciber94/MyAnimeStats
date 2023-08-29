<script lang="ts">
	import { AnimeSeasonDate } from '@/lib/myanimelist/common/AnimeSeasonDate';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { createEventDispatcher } from 'svelte';

	function getSeasons() {
		const seasons: AnimeSeasonDate[] = [];
		const currentSeason = AnimeSeasonDate.current();
		let season = currentSeason.prev.prev;

		for (let i = 0; i < 5; i++) {
			seasons.push(season);
			season = season.next;
		}

		return seasons;
	}

	const dispatch = createEventDispatcher<{
		click: { season: AnimeSeason; year: number };
	}>();
	const seasons = getSeasons();

	function onSeasonClick({ season, year }: AnimeSeasonDate) {
		dispatch('click', { season, year });
	}
</script>

<div class="flex flex-row gap-2 justify-around">
	{#each seasons as season}
		<button
			on:click={() => onSeasonClick(season)}
			class="text-sm text-white transition duration-200 rounded-full
            bg-violet-500 hover:bg-pink-600 px-4 py-2 font-semibold min-w-[120px]"
		>
			{season.toString()}
		</button>
	{/each}
</div>
