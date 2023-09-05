<script lang="ts">
	import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
	import { ChartSolid, CheckSolid, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import Enumerable from 'linq';
	import AnimatedNumber from '../../components/AnimatedNumber.svelte';

	export let animeList: AnimeObjectWithStatus[];

	const averageScore = Enumerable.from(animeList).average((x) => x.list_status.score);
	const bestScored = Enumerable.from(animeList)
		.orderByDescending((x) => x.list_status.score)
		.take(10)
		.orderByDescending((x) => Math.random() * 100)
		.take(5)
		.toArray();

	let selectedBestAnimeIndex = -1;

	$: selectedAnime = bestScored[selectedBestAnimeIndex];

	function getTypicalScore() {
		const mostLikelyScore = Enumerable.from(animeList)
			.groupBy((c) => c.list_status.score)
			.orderByDescending((c) => c.count())
			.toArray();

		return mostLikelyScore[0]?.key() ?? 0;
	}
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
			>
				<AnimatedNumber id="average-score" once value={averageScore} decimalPlaces={2} />
			</span>
		</div>
	</div>

	<div
		class="text-white mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2 text-lg sm:text-2xl
	shadow-md border-2 border-violet-900 p-4 rounded-lg"
	>
		<div class="flex flex-row gap-3 items-center">
			<ChevronDoubleRightOutline class="h-6 w-6 text-orange-500" />
			<span class="text-orange-500">Typical Score</span>
		</div>
		<div>
			<span
				class="bg-violet-600 text-white py-2 px-6 cursor-pointer shadow-lg text-center rounded-md"
			>
				<AnimatedNumber id="typical-score" once value={getTypicalScore()} decimalPlaces={2} />
			</span>
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

		<div class="w-full p-2 sm:p-4 flex flex-row flex-wrap justify-center gap-2 sm:gap-4">
			{#each bestScored as anime, index}
				<button
					on:click={() => {
						selectedBestAnimeIndex = selectedBestAnimeIndex === index ? -1 : index;
					}}
					style={`animation-delay: ${index * 100}ms;`}
					class={`rounded-lg border-4 w-[max(120px,30vw)] h-[max(120px,30vw)] sm:w-[200px] sm:h-[200px] shadow-lg
			overflow-hidden hover:rotate-3 rotate-1 transition duration-300
			hover:scale-110 cursor-pointer animate-fade-left animate-duration-300
			${selectedBestAnimeIndex === index ? 'border-orange-500' : 'border-violet-500'}`}
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
				<a
					href={`/anime/${selectedAnime.node.id}`}
					class="py-1 px-4 rounded-lg text-white bg-orange-500 hover:bg-orange-600 flex flex-row gap-2 justify-center"
				>
					<span>{selectedAnime.node.title}</span>
				</a>
			{/if}
		</div>
	</div>
</section>
