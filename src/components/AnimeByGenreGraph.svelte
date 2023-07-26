<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import type { CalculatedStats } from '$lib/types';

	export let stats: CalculatedStats;
	let chartCanvas: HTMLCanvasElement;

	const dataSet: { genre: string; totalWatched: number }[] = [];
	for (const [genre, totalWatched] of Object.entries(stats.animeByGenre)) {
		dataSet.push({ genre, totalWatched });
	}

	const bgColors = [
		'rgb(255, 204, 204)', // Light Pink
		'rgb(255, 229, 204)', // Pale Orange
		'rgb(204, 255, 204)', // Light Green
		'rgb(204, 204, 255)', // Light Blue
		'rgb(255, 204, 255)', // Lavender
		'rgb(255, 255, 204)', // Light Yellow
		'rgb(204, 255, 255)', // Light Cyan
		'rgb(255, 219, 172)', // Peach
		'rgb(204, 255, 230)', // Mint Green
		'rgb(255, 204, 229)', // Pale Pink
		'rgb(204, 229, 255)', // Baby Blue
		'rgb(255, 230, 204)', // Apricot
		'rgb(204, 255, 253)', // Light Turquoise
		'rgb(255, 204, 179)', // Light Coral
		'rgb(204, 179, 255)', // Lilac
		'rgb(255, 204, 255)', // Pale Lavender
		'rgb(204, 255, 204)', // Light Mint
		'rgb(255, 204, 229)', // Pale Pink
		'rgb(204, 255, 204)', // Light Green
		'rgb(255, 204, 204)' // Light Pink
	];
	const data = {
		labels: dataSet.map((x) => x.genre),
		datasets: [
			{
				label: 'Anime By Genre',
				data: dataSet.map((x) => x.totalWatched),
				backgroundColor: bgColors,
				hoverOffset: 30
			}
		]
	};

	onMount(() => {
		Chart.register(...registerables);
		new Chart(chartCanvas, {
			type: 'doughnut',
			data: data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'center'
					}
					// title: {
					// 	display: true,
					// 	text: 'Anime By Genre'
					// }
				}
			}
		});
	});
</script>

<div class="w-11/12 lg:w-7/12 flex flex-row justify-center mx-auto">
	<canvas bind:this={chartCanvas} />
</div>
