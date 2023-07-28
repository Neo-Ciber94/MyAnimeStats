<script context="module" lang="ts">
	export type AnimeBySeason = { season: string; year: number; animeList: AnimeNode[] };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { seasonToNumber, type AnimeNode, type AnimeSeason } from '$lib/myanimelist/common/types';
	import { error } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import Enumerable from 'linq';

	export let animeList: AnimeNode[];
	let chartCanvas: HTMLCanvasElement;

	function getAnimeWatchedInYearRange({ from, to }: { from: number; to: number }) {
		return animeList.filter((anime) => {
			const myAnimeStatus = anime.node.my_list_status;
			if (myAnimeStatus == null) {
				throw error(500, `user my anime status for series '${anime.node.title}' was not found`);
			}

			const hadWatched =
				myAnimeStatus.status === 'completed' ||
				myAnimeStatus.status === 'watching' ||
				myAnimeStatus.status === 'on_hold' ||
				myAnimeStatus.status === 'dropped';

			const endDate = dayjs(anime.node.end_date);
			return hadWatched && (endDate == null || (endDate.year() >= from && endDate.year() <= to));
		});
	}

	const fromYear = 2020;
	const toYear = 2023;
	const animeWatched = getAnimeWatchedInYearRange({ from: fromYear, to: toYear });

	const watchedBySeason = new Map<string, AnimeBySeason>();
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

	const entries = Enumerable.from(watchedBySeason.entries())
		.orderBy(([_, x]) => x.year)
		.thenBy(([_, x]) => seasonToNumber(x.season as AnimeSeason))
		.toArray();

	const labels = entries.map(([seasonAndYear, _]) => seasonAndYear);
	const animeWatchedCount = entries.map(([_, watched]) => watched.animeList.length);

	onMount(() => {
		Chart.register(...registerables);
		new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: `Watched in ${fromYear}-${toYear}`,
						data: animeWatchedCount,
						fill: false,
						borderColor: 'rgb(75, 192, 192)',
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
	});
</script>

<div class="w-11/12 flex flex-row justify-center mx-auto min-h-screen">
	<canvas bind:this={chartCanvas} />
</div>
