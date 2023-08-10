<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import { Chart, registerables } from 'chart.js';
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

	onMount(() => {
		Chart.register(...registerables);

		new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						data: scores,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(201, 203, 207, 0.2)'
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)',
							'rgb(201, 203, 207)'
						],
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

<div class="w-11/12 flex flex-row justify-center mx-auto min-h-[300vh]">
	<canvas bind:this={chartCanvas} />
</div>
