<script lang="ts">
	import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
	import { Chart, registerables } from 'chart.js';
	import Color from 'color';
	import Enumerable from 'linq';
	import { onMount } from 'svelte';

	export let animeList: AnimeObjectWithStatus[];

	let chartCanvas: HTMLCanvasElement;

	const scoresByStudio = new Map<string, AnimeObjectWithStatus[]>();

	for (const anime of animeList) {
		for (const studio of anime.node.studios) {
			const animeForStudio = scoresByStudio.get(studio.name) || [];
			animeForStudio.push(anime);
			scoresByStudio.set(studio.name, animeForStudio);
		}
	}

	const entries = Enumerable.from(scoresByStudio.entries())
		.orderBy((x) => x[0])
		.toArray();

	const dataset = Enumerable.from(entries)
		.select(([studio, animeForStudio]) => {
			const averageScore = Enumerable.from(animeForStudio).average((x) => x.list_status.score);
			const studioAndAnimeCount = `${studio} (${animeForStudio.length})`;
			const animeCount = animeForStudio.length;
			return { studioAndAnimeCount, animeCount, averageScore };
		})
		.orderByDescending((x) => x.animeCount)
		.thenBy((x) => x.averageScore)
		.toArray();

	const labels = dataset.map((x) => x.studioAndAnimeCount);
	const scores = dataset.map((x) => x.averageScore);
	const minWidth = dataset.length * 4;

	onMount(() => {
		Chart.register(...registerables);

		const colors = ['#9f40ff', '#ff8000', '#ff0000', '#00f995', '#ffff00', '#e4e4e4'].map((c) =>
			Color(c)
		);
		const bgColors = colors.map((c) => c.fade(0.5).rgb().toString());
		const borderColors = colors.map((c) => c.rgb().toString());

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
						text: 'Scores by studio',
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

<div class="w-11/12 flex flex-row justify-center mx-auto min-h-[500vh]">
	<canvas bind:this={chartCanvas} />
</div>
