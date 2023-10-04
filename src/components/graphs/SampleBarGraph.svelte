<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let chart: Chart;
	let chartCanvas: HTMLCanvasElement;

	let sampleData: { genre: string; count: number }[] = [
		{
			genre: 'Shounen',
			count: 100
		},
		{
			genre: 'Romance',
			count: 60
		},
		{
			genre: 'Seinen',
			count: 80
		},
		{
			genre: 'Gourmet',
			count: 90
		},
		{
			genre: 'Comedy',
			count: 76
		},
		{
			genre: 'Ecchi',
			count: 12
		}
	];

	function renderChart() {
		if (chart) {
			chart.destroy();
		}

		Chart.register(...registerables);
		chart = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels: sampleData.map((x) => x.genre),
				datasets: [
					{
						data: sampleData.map((x) => x.count),
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
						barThickness: 30,
						categoryPercentage: 1,
						barPercentage: 0.5
					}
				]
			},
			options: {
				//responsive: true,
				indexAxis: 'y',
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							display: false
						},
						position: 'right',
						ticks: {
							color: 'white'
						}
					},
					x: {
						grid: {
							display: false
						},
						reverse: true,
						ticks: {
							color: 'white'
						},
						max: 100,
						beginAtZero: true
					}
				},
				plugins: {
					legend: false,
					title: {
						display: true,
						text: 'Watched by genre',
						color: '#ff3b83',
						font: {
							size: 16
						}
					}
				}
			}
		});
	}

	$: {
		if (sampleData) {
			renderChart();
		}
	}

	onMount(() => renderChart());

	onMount(() => {
		const interval = window.setInterval(() => {
			sampleData = sampleData.map((x) => ({
				...x,
				count: Math.floor(Math.random() * 100)
			}));
		}, 4000);

		return () => {
			window.clearInterval(interval);
		};
	});
</script>

<div
	class={twMerge(
		`w-10/12 flex flex-row justify-center items-center mx-auto h-full`,
		$$restProps.class
	)}
>
	<canvas bind:this={chartCanvas} height="200" />
</div>
