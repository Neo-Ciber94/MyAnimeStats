<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';

	let chartCanvas: HTMLCanvasElement;

	const data = {
		labels: ['Red', 'Blue', 'Yellow'],
		datasets: [
			{
				label: 'My First Dataset',
				data: [300, 50, 100],
				backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
				hoverOffset: 4
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
						position: 'top'
					},
					title: {
						display: true,
						text: 'Chart.js Doughnut Chart'
					},
					tooltip: {}
				}
			}
		});
	});
</script>

<div class="w-11/12 lg:w-7/12 flex flex-row justify-center mx-auto">
	<canvas bind:this={chartCanvas} />
</div>
