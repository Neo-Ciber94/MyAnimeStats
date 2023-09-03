<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import type { AnimeObjectWithStatus } from '$lib/myanimelist/common/types';
	import Enumerable from 'linq';
	import dayjs from 'dayjs';
	import Color from 'color';

	export let animeList: AnimeObjectWithStatus[];

	let chartCanvas: HTMLCanvasElement;

	const orderedByScore = Enumerable.from(animeList)
		//.where((x) => x.node.start_date != null)
		.orderBy((x) => dayjs(x.node.end_date))
		.toArray();

	const scores = orderedByScore.map((x) => x.list_status.score);
	const labels = orderedByScore.map((x) => {
		const d = dayjs(x.node.end_date);
		return `${d.format('MMMM')} - ${d.year()}`;
	});

	onMount(() => {
		Chart.register(...registerables);
		new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Score over time',
						data: scores,
						backgroundColor: Color('#ff8000').fade(0.8).rgb().toString(),
						borderColor: '#ff8000',
						fill: true,
						showLine: true,
						tension: 0.4
					}
				]
			},
			options: {
				responsive: true,
				datasets: {
					line: {
						borderWidth: 1
					}
				},
				plugins: {
					legend: {
						display: true,
						labels: {
							color: 'white',
							font: {
								weight: 'bold',
								size: 20
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
