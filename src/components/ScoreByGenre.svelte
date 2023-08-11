<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import { hash, numberToColor } from '$lib/utils/helpers';
	import { Chart, registerables } from 'chart.js';
	import Color from 'color';
	import Enumerable from 'linq';
	import { onMount } from 'svelte';

	export let animeList: AnimeNodeWithStatus[];

	let chartCanvas: HTMLCanvasElement;

	const scoresByGenre = new Map<string, AnimeNodeWithStatus[]>();

	for (const anime of animeList) {
		for (const genre of anime.node.genres) {
			const animeOfGenre = scoresByGenre.get(genre.name) || [];
			animeOfGenre.push(anime);
			scoresByGenre.set(genre.name, animeOfGenre);
		}
	}

	const entries = Enumerable.from(scoresByGenre.entries())
		.orderBy((x) => x[0])
		.toArray();

	const dataset = Enumerable.from(entries)
		.select(([genre, animeOfGenre]) => {
			const averageScore = Enumerable.from(animeOfGenre).average((x) => x.list_status.score);
			return { genre, averageScore };
		})
		.orderByDescending((x) => x.averageScore)
		.toArray();

	const labels = dataset.map((x) => x.genre);
	const scores = dataset.map((x) => x.averageScore);
	const minWidth = dataset.length * 4;

	onMount(() => {
		Chart.register(...registerables);

		const colors = labels.map((c) => Color(numberToColor(hash(c)))).map((c) => c.rotate(30));
		const bgColors = colors.map((c) => c.fade(0.7).rgb().toString());
		const borderColors = colors.map((c) => c.lighten(0.4).saturate(0.9).rgb().toString());

		new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						data: scores,
						backgroundColor: bgColors,
						borderColor: borderColors,
						borderWidth: 1,
						barThickness: 20,
						categoryPercentage: 1,
						barPercentage: 0.5
					}
				]
			},
			options: {
				indexAxis: 'y',
				elements: {
					bar: {
						borderWidth: 2
					}
				},
				maintainAspectRatio: false,
				scales: {
					y: {
						stacked: true,
						ticks: {
							color: 'white',
							autoSkip: false,
							font: {
								size: 15
							}
						}
					}
				},
				plugins: {
					legend: false,
					title: {
						display: true,
						text: 'Scores by anime genre',
						color: 'white',
						font: {
							size: 20
						}
					}
				}
			}
		});
	});
</script>

<div class="w-11/12 flex flex-row justify-center mx-auto" style="min-height: {minWidth}vh;">
	<canvas bind:this={chartCanvas} />
</div>
