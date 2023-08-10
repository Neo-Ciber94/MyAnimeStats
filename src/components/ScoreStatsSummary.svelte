<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import { ChartSolid, CheckSolid } from 'flowbite-svelte-icons';
	import Enumerable from 'linq';

	export let animeList: AnimeNodeWithStatus[];

	const averageScore = Enumerable.from(animeList).average((x) => x.list_status.score);
	const bestScored = Enumerable.from(animeList)
		.orderByDescending((x) => x.list_status.score)
		.take(5)
		.toArray();

	let selectedBestAnimeIndex = -1;

	$: selectedAnime = bestScored[selectedBestAnimeIndex];
</script>

<section>
	<div
		class="text-white mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2 text-lg sm:text-2xl
		shadow-md border-2 border-violet-900 p-4 rounded-lg"
	>
		<div class="flex flex-row gap-3 items-center">
			<ChartSolid class="h-6 w-6 text-orange-500" />
			<span class="text-orange-500">Average Score</span>
		</div>
		<div>
			<span
				class="bg-violet-600 text-white py-2 px-6 cursor-pointer shadow-lg text-center rounded-md"
				>{averageScore.toFixed(2)}</span
			>
		</div>
	</div>

	<div
		class="text-white mt-4 flex flex-col gap-2 text-lg sm:text-2xl
		shadow-md border-2 border-violet-900 p-4 rounded-lg"
	>
		<div class="flex flex-row gap-3 items-center">
			<CheckSolid class="h-6 w-6 text-orange-500" />
			<span class="text-orange-500">Best scored</span>
		</div>

		<div class="w-full p-4 flex flex-row flex-wrap justify-center gap-4">
			{#each bestScored as anime, index}
				<button
					on:click={() => {
						selectedBestAnimeIndex = selectedBestAnimeIndex === index ? -1 : index;
					}}
					class={`rounded-lg border-4 w-[200px] h-[200px] shadow-lg
						overflow-hidden hover:rotate-3 rotate-1 transition duration-300
						hover:scale-110 cursor-pointer ${
							selectedBestAnimeIndex === index ? 'border-orange-500' : 'border-violet-500'
						}`}
				>
					<img
						class="object-cover aspect-square"
						src={anime.node.main_picture.large}
						alt={anime.node.title}
					/>
				</button>
			{/each}
		</div>

		<div class="w-full text-center">
			{#if selectedAnime}
				<div
					class="py-1 px-4 rounded-lg text-white bg-orange-500 flex flex-row gap-2 justify-center"
				>
					<span>{selectedAnime.node.title}</span>
				</div>
			{/if}
		</div>
	</div>
</section>
