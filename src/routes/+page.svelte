<script lang="ts">
	import { getCurrentAnimeSeason } from '$lib/myanimelist/common/helpers';
	import AnimeCard from '../components/AnimeCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { season, year } = getCurrentAnimeSeason();
</script>

<div class="mx-10 text-white text-2xl uppercase font-bold mb-4">
	<h1>{season} - {year}</h1>
</div>
<div class="grid grid-cols-6 gap-2 items-center mx-10">
	{#each data.data as anime}
		<AnimeCard {anime} />
	{/each}
</div>
