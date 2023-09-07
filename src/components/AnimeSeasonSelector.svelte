<script lang="ts">
	import type { AnimeSeasonDate } from '@/lib/myanimelist/common/AnimeSeasonDate';
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import { createEventDispatcher } from 'svelte';
	import AnimeSeasonSelectorButton from './AnimeSeasonSelectorButton.svelte';
	import { scale } from 'svelte/transition';

	export let current: AnimeSeasonDate;
	export let min: AnimeSeasonDate | undefined = undefined;
	export let max: AnimeSeasonDate | undefined = undefined;

	function getSeasons() {
		const length = 4;
		const seasons = Array<AnimeSeasonDate | undefined>();
		let cur = current.prev.prev;

		for (let i = 0; i < length; i++) {
			if (cur.compare(current) === 0) {
				cur = cur.next;
			}

			if (min && cur.compare(min) < 0) {
				seasons.push(undefined);
			}
			if (max && cur.compare(max) > 0) {
				seasons.push(undefined);
			} else {
				seasons.push(cur);
			}

			// seasons.push(cur);
			cur = cur.next;
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

<div class="flex flex-col md:flex-row gap-2 justify-between">
	<div class="flex flex-col xs:flex-row gap-2 justify-between w-full">
		{#each seasons.slice(0, 2) as season}
			{#if season != null}
				{@const s = season}
				<div in:scale class="w-full">
					<AnimeSeasonSelectorButton {season} on:click={() => onSeasonClick(s)} />
				</div>
			{:else}
				<div class="w-full" />
			{/if}
		{/each}
	</div>

	<div class="flex flex-col xs:flex-row gap-2 justify-between w-full">
		{#each seasons.slice(2, 4) as season}
			{#key [season]}
				{#if season != null}
					{@const s = season}
					<div in:scale class="w-full">
						<AnimeSeasonSelectorButton {season} on:click={() => onSeasonClick(s)} />
					</div>
				{:else}
					<div class="w-full" />
				{/if}
			{/key}
		{/each}
	</div>
</div>
