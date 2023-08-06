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
	import { Input, Label, Select } from 'flowbite-svelte';
	import { CalendarMonthSolid } from 'flowbite-svelte-icons';
	import Color from 'color';
	import { capitalize, hash, numberToColor } from '$lib/utils/helpers';
	import type { AutocompleteItem } from './Autocomplete.svelte';
	import Autocomplete from './Autocomplete.svelte';

	export let animeList: AnimeNode[];

	const now = dayjs();
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let fromYear = now.year() - 5;
	let toYear = now.year();
	let currentGenre: string | undefined;
	let isInit = false;

	let animeWatched: AnimeNode[] = [];
	let watchedBySeason = new Map<string, AnimeBySeason>();

	// Genres
	const animeGenres: AutocompleteItem[] = Enumerable.from(animeList)
		.selectMany(({ node }) => node.genres)
		.distinct((x) => x.id)
		.select((x) => ({ label: x.name, value: x.name }))
		.toArray();

	animeGenres.splice(0, 0, { label: 'All', value: undefined });

	function drawGraph() {
		if (!isInit) {
			return;
		}

		if (chart) {
			chart.destroy();
		}

		const entries = Enumerable.from(watchedBySeason.entries())
			.orderBy(([_, x]) => x.year)
			.thenBy(([_, x]) => seasonToNumber(x.season as AnimeSeason))
			.toArray();

		const labels = entries.map(([seasonAndYear, _]) => capitalize(seasonAndYear));
		const animeWatchedCount = entries.map(([_, watched]) => watched.animeList.length);

		Chart.register(...registerables);

		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: `${
							currentGenre == null ? 'Anime watched' : `${currentGenre} anime watched`
						} in ${fromYear}-${toYear}`,
						data: animeWatchedCount,
						fill: false,
						borderColor:
							currentGenre == null
								? 'rgb(75, 192, 192)'
								: Color(numberToColor(hash(currentGenre)))
										.saturate(50)
										.hex(),
						tension: 0.1
					}
				]
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
		watchedBySeason = new Map<string, AnimeBySeason>();

		animeWatched = getAnimeWatchedByYear(animeList, {
			from: Number(fromYear),
			to: Number(toYear),
			genre: currentGenre === '0' ? undefined : currentGenre
		});

		for (const anime of animeWatched) {
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

		drawGraph();
	}
</script>

<div class="w-11/12">
	<div class="ml-3 mb-14 flex flex-row gap-4">
		<div class="flex flex-row gap-3 w-[400px]">
			<Input
				class="text-md focus:ring-indigo-500 focus:border-indigo-500"
				placeholder="From Year"
				type="number"
				max={toYear}
				bind:value={fromYear}
			/>
			<Input
				class="text-md focus:ring-indigo-500 focus:border-indigo-500"
				placeholder="To Year"
				type="number"
				min={fromYear}
				max={now.year()}
				bind:value={toYear}
			/>
		</div>

		<Autocomplete
			bind:value={currentGenre}
			items={animeGenres}
			placeholder="Select a genre..."
			class="w-full rounded-md h-full px-2 border-none outline-none"
		/>
	</div>

	<div class="flex flex-row justify-center mx-auto min-h-screen">
		<canvas bind:this={chartCanvas} />
	</div>
</div>
