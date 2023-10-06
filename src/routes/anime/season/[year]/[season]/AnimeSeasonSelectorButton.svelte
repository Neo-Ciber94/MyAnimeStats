<script lang="ts">
	import type { AnimeSeasonYear } from '@/lib/myanimelist/common/AnimeSeasonYear';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import SeasonWinter from '$components/seasons/SeasonWinter.svelte';
	import SeasonSpring from '$components/seasons/SeasonSpring.svelte';
	import SeasonSummer from '$components/seasons/SeasonSummer.svelte';
	import SeasonFall from '$components/seasons/SeasonFall.svelte';

	export let season: AnimeSeasonYear;
	const SEASONS: Record<AnimeSeason, { icon: any; name: string }> = {
		winter: {
			icon: SeasonWinter,
			name: 'Winter'
		},
		spring: {
			icon: SeasonSpring,
			name: 'Spring'
		},
		summer: {
			icon: SeasonSummer,
			name: 'Summer'
		},
		fall: {
			icon: SeasonFall,
			name: 'Fall'
		}
	};
</script>

<button
	on:click
	data-season={season.season}
	data-season-year={season.year}
	class="text-sm text-white transition duration-200 rounded-lg w-full
		bg-violet-500 hover:bg-pink-600 px-4 py-2 font-semibold min-w-[120px]
		flex flex-row items-center gap-2 justify-center pr-4 group"
>
	<svelte:component this={SEASONS[season.season].icon} size={18} class="season-svg" />

	<span>{season.toString()}</span>
</button>

<style lang="postcss">
	:global(.season-svg path) {
		@apply fill-violet-800 group-hover:fill-pink-800;
	}
</style>
