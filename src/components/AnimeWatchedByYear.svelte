<script context="module" lang="ts">
	export type AnimeBySeason = { season: string; year: number; animeList: AnimeObject[] };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import {
		seasonToNumber,
		type AnimeObject,
		type AnimeSeason
	} from '$lib/myanimelist/common/types';
	import dayjs from 'dayjs';
	import Enumerable from 'linq';
	import { getAnimeWatchedByYear } from '$lib/utils/getAnimeWatchedByYear';
	import { Input } from 'flowbite-svelte';
	import Color from 'color';
	import { capitalize, hash, numberToColor } from '$lib/utils/helpers';
	import type { AutocompleteItem } from './Autocomplete.svelte';
	import { CalendarMonthSolid, ListSolid } from 'flowbite-svelte-icons';
	import TagInput from './TagInput.svelte';

	export let animeList: AnimeObject[];

	const now = dayjs();
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let fromYear = now.year() - 5;
	let toYear = now.year();
	let isInit = false;

	// Genres
	const animeGenres: AutocompleteItem<string | null>[] = Enumerable.from(animeList)
		.selectMany(({ node }) => node.genres)
		.distinct((x) => x.id)
		.select((x) => ({ label: x.name, value: x.name }))
		.toArray();

	animeGenres.splice(0, 0, { label: 'All Anime', value: null });

	let filters: { genre?: string | null; watched: AnimeObject[] }[] = [
		{
			genre: null,
			watched: []
		}
	];

	$: selectedGenres = filters.map((x) => x.genre);

	function getHashColor(s: string) {
		return Color(numberToColor(hash(s)))
			.saturate(50)
			.hex();
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

			// prettier-ignore
			const label = `${filter.genre == null ? 'Anime watched' : `${filter.genre} anime watched`}`;
			const borderColor = filter.genre == null ? 'rgb(75, 192, 192)' : getHashColor(filter.genre);

			datasets.push({
				label,
				data: animeWatchedCount,
				fill: true,
				borderColor,
				tension: 0.2,
				pointRadius: 7,
				pointHoverRadius: 12
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
				responsive: true,
				plugins: {
					legend: {
						display: true,
						labels: {
							color: 'white',
							font: {
								size: 15,
								weight: 'bold'
							}
						}
					}
				}
			}
		});
	}

	function handleAdd(event: CustomEvent<AutocompleteItem<string | null | undefined>>) {
		const item = {
			genre: event.detail.value,
			watched: []
		};
		filters = [...filters, item];
	}

	function handleRemove(event: CustomEvent<AutocompleteItem<string | null | undefined>>) {
		filters = filters.filter((x) => x.genre !== event.detail.value);
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
	<div class="ml-3 mb-4 flex flex-col sm:flex-row gap-4 h-full">
		<div class="flex flex-col lg:flex-row gap-3 w-full">
			<div
				class="w-full flex flex-row gap-2 items-center border-b-2 pb-2 border-b-violet-500 focus-within:border-b-orange-500"
			>
				<div class="flex flex-row items-center gap-2">
					<CalendarMonthSolid class="w-4 h-4 mx-2 text-violet-500" />
					<div class="text-violet-500 whitespace-nowrap min-w-[80px]">From Year</div>
				</div>

				<input
					class="w-full text-md text-white bg-transparent border-none focus:ring-0 text-right"
					placeholder="From Year"
					type="number"
					max={toYear}
					bind:value={fromYear}
				/>
			</div>

			<div
				class="w-full flex flex-row gap-2 items-center border-b-2 pb-2 border-b-violet-500 focus-within:border-b-orange-500"
			>
				<div class="flex flex-row items-center gap-2">
					<CalendarMonthSolid class="w-4 h-4 mx-2 text-orange-500" />
					<div class="text-orange-500 whitespace-nowrap min-w-[80px]">To Year</div>
				</div>

				<input
					class="w-full text-md text-white bg-transparent border-none focus:ring-0 text-right"
					placeholder="To Year"
					type="number"
					min={fromYear}
					max={now.year()}
					bind:value={toYear}
				/>
			</div>
		</div>
	</div>

	<div class="ml-3 mb-12 flex flex-col gap-2">
		<TagInput
			placeholder="Select the genres..."
			items={animeGenres}
			bind:selected={selectedGenres}
			on:added={handleAdd}
			on:removed={handleRemove}
			listClass="backdrop-blur-md border-violet-500"
			class=" gap-2 bg-transparent focus-within:border-b-orange-500 text-white border-b-2 pb-2 border-b-violet-500"
		>
			<div slot="icon" class="mx-2">
				<ListSolid class="text-orange-500 !outline-none" />
			</div>

			<div
				let:item
				let:active
				slot="option"
				class={`py-2 pl-4 w-full h-full text-left bg-transparent text-white hover:bg-violet-500 ${
					active ? 'bg-violet-600' : ''
				}`}
			>
				{item.label}
			</div>
		</TagInput>
	</div>

	<div class="flex flex-row justify-center mx-auto min-h-screen relative w-full">
		<canvas bind:this={chartCanvas} />
	</div>
</div>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		margin-left: 20px;
	}
</style>
