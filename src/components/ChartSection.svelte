<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		RadialLinearScale,
		TimeScale,
		ArcElement,
		PolarAreaController
	} from 'chart.js';

	let chartCanvas: HTMLCanvasElement;

	const data = {
		labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
		datasets: [
			{
				label: 'My First Dataset',
				data: [11, 16, 7, 3, 14],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(75, 192, 192)',
					'rgb(255, 205, 86)',
					'rgb(201, 203, 207)',
					'rgb(54, 162, 235)'
				]
			}
		]
	};

	onMount(() => {
		Chart.register(
			ArcElement,
			RadialLinearScale,
			CategoryScale,
			LinearScale,
			PointElement,
			LineElement,
			TimeScale,
			PolarAreaController
		);

		new Chart(chartCanvas, {
			type: 'polarArea',
			data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: 'Chart.js Polar Area Chart'
					}
				}
			}
		});
	});
</script>

<div class="w-9/12 text-center mx-auto">
	<canvas id="my-chart" bind:this={chartCanvas} />
</div>
