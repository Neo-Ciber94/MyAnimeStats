<script context="module" lang="ts">
	export type AnimeBySeason = { season: string; year: number; animeList: AnimeNode[] };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { seasonToNumber, type AnimeNode, type AnimeSeason } from '$lib/myanimelist/common/types';
	import dayjs from 'dayjs';
	import Enumerable from 'linq';
	import { getAnimeWatchedByYear } from '$lib/utils/getAnimeWatchedByYear';
	import { Button, Input } from 'flowbite-svelte';
	import Color from 'color';
	import { capitalize, hash, numberToColor } from '$lib/utils/helpers';
	import type { AutocompleteItem } from './Autocomplete.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import { CalendarMonthSolid, TrashBinSolid } from 'flowbite-svelte-icons';

	export let animeList: AnimeNode[];

	const now = dayjs();
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let fromYear = now.year() - 5;
	let toYear = now.year();
	let isInit = false;

	// Genres
	const animeGenres: AutocompleteItem[] = Enumerable.from(animeList)
		.selectMany(({ node }) => node.genres)
		.distinct((x) => x.id)
		.select((x) => ({ label: x.name, value: x.name }))
		.toArray();

	animeGenres.splice(0, 0, { label: 'All Anime', value: null });

	let filters: { genre?: string | null; watched: AnimeNode[] }[] = [
		{
			genre: null,
			watched: []
		}
	];

	function getHashColor(s: string) {
		return Color(numberToColor(hash(s)))
			.saturate(50)
			.hex();
	}

	function addDataset() {
		filters = [...filters, { genre: undefined, watched: [] }];
	}

	function removeDataset(index: number) {
		if (index === 0) {
			console.warn('Cannot remove base dataset');
			return;
		}

		filters = filters.filter((_, i) => i !== index);
	}

	function drawGraph() {
		if (!isInit) {
			return;
		}

		if (chart) {
			chart.destroy();
		}

		const datasets = [];
		let labels: string[] = [];

		for (const filter of filters) {
			const watchedBySeason = new Map<string, AnimeBySeason>();

			for (const anime of filter.watched) {
				const season = anime.node.start_season?.season;

				if (season == null) {
					console.warn(`Anime '${anime.node.title}' do not have a start season`);
					continue;
				}

				const year = dayjs(anime.node.end_date).year();
				const key = `${season} (${year})`;
				const animeList = watchedBySeason.get(key)?.animeList || [];
				animeList.push(anime);
				watchedBySeason.set(key, {
					animeList,
					season,
					year
				});
			}

			const entries = Enumerable.from(watchedBySeason.entries())
				.orderBy(([_, x]) => x.year)
				.thenBy(([_, x]) => seasonToNumber(x.season as AnimeSeason))
				.toArray();

			// Set the graph labels once
			if (labels.length === 0) {
				labels = entries.map(([seasonAndYear, _]) => capitalize(seasonAndYear));
			}

			const animeWatchedCount = entries.map(([_, watched]) => watched.animeList.length);
			const yearRange = `${fromYear}-${toYear}`;

			// prettier-ignore
			const label = `${filter.genre == null ? 'Anime watched' : `${filter.genre} anime watched`} in ${yearRange}`;
			const borderColor = filter.genre == null ? 'rgb(75, 192, 192)' : getHashColor(filter.genre);

			datasets.push({
				label,
				data: animeWatchedCount,
				fill: false,
				borderColor,
				tension: 0.1
			});
		}

		Chart.register(...registerables);

		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels,
				datasets
			},
			options: {
				plugins: {
					legend: {
						labels: {
							color: 'white',
							font: {
								size: 20,
								weight: 'bold'
							}
						}
					}
				}
			}
		});
	}

	onMount(() => {
		isInit = true;
		drawGraph();
	});

	$: {
		for (const filter of filters) {
			filter.watched = getAnimeWatchedByYear(animeList, {
				from: Number(fromYear),
				to: Number(toYear),
				genre: filter.genre == null ? undefined : filter.genre
			});
		}

		drawGraph();
	}
</script>

<div class="w-11/12">
	<div class="ml-3 mb-4 flex flex-col sm:flex-row gap-4 h-full sm:h-10">
		<div class="flex flex-row gap-3 w-full sm:w-[400px] h-10">
			<Input
				class="text-md focus:ring-indigo-500 focus:border-indigo-500"
				placeholder="From Year"
				type="number"
				max={toYear}
				bind:value={fromYear}
			>
				<CalendarMonthSolid slot="left" class="w-4 h-4 text-violet-500" />
			</Input>
			<Input
				class="text-md focus:ring-indigo-500 focus:border-indigo-500"
				placeholder="To Year"
				type="number"
				min={fromYear}
				max={now.year()}
				bind:value={toYear}
			>
				<CalendarMonthSolid slot="left" class="w-4 h-4 text-orange-500" />
			</Input>
		</div>

		<Autocomplete
			bind:value={filters[0].genre}
			items={animeGenres}
			placeholder="Select a genre..."
			class="w-full rounded-md h-10 px-2 border-none outline-none"
		/>
	</div>

	<div class="ml-3 mb-12 flex flex-col gap-2">
		{#each filters as filter, index}
			{#if index > 0}
				<div class="flex flex-row gap-2 items-center">
					<Autocomplete
						bind:value={filter.genre}
						items={animeGenres}
						placeholder="Select a genre..."
						class="w-full rounded-md h-10 px-2 border-none outline-none"
					/>

					<button
						on:click={() => removeDataset(index)}
						class="group h-full w-12 justify-center bg-transparent hover:bg-transparent flex flex-row items-center"
					>
						<TrashBinSolid class="text-red-500 group-hover:text-red-600 !outline-none" />
					</button>
				</div>
			{/if}
		{/each}

		<Button class="mt-2" on:click={addDataset}>Add Dataset</Button>
	</div>

	<div class="flex flex-row justify-center mx-auto min-h-screen">
		<canvas bind:this={chartCanvas} />
	</div>
</div>
