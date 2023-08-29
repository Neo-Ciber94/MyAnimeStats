<script lang="ts">
	import type { AnimeSeasonDate } from '@/lib/myanimelist/common/AnimeSeasonDate';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { createEventDispatcher } from 'svelte';

	export let season: AnimeSeasonDate;

	const dispatch = createEventDispatcher<{
		click: { season: AnimeSeason; year: number };
	}>();

	function onSeasonClick({ season, year }: AnimeSeasonDate) {
		dispatch('click', { season, year });
	}
</script>

<button
	on:click={() => onSeasonClick(season)}
	class="text-sm text-white transition duration-200 rounded-lg w-full
bg-violet-500 hover:bg-pink-600 px-4 py-2 font-semibold min-w-[120px]"
>
	{season.toString()}
</button>
