<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import Color from 'color';
	import { PASTEL_COLORS } from '../common/constants';
	import type { AnimeObjectWithStatus } from '@/lib/myanimelist/common/types';

	export let animeList: AnimeObjectWithStatus[];
	let chartCanvas: HTMLCanvasElement;
	const animeData: { genre: string; totalWatched: number }[] = [];

	for (const animeNode of animeList) {
		for (const genre of animeNode.node.genres) {
			const animeOfGenre = animeData.find((x) => x.genre === genre.name);

			if (animeOfGenre == null) {
				animeData.push({
					genre: genre.name,
					totalWatched: 1
				});
			} else {
				animeOfGenre.totalWatched += 1;
			}
		}
	}

	animeData.sort((a, b) => {
		return b.totalWatched - a.totalWatched;
	});

	const minWidth = animeData.length * 4;
	const labels = animeData.map((x) => x.genre);

	onMount(() => {
		Chart.register(...registerables);
		new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'Genres',
						data: animeData.map((x) => x.totalWatched),
						borderColor: PASTEL_COLORS.map((c) => Color(c).darken(0.3).toString()),
						backgroundColor: PASTEL_COLORS.map((c) => Color(c).darken(0.3).fade(0.7).toString()),
						barThickness: 20,
						categoryPercentage: 1,
						barPercentage: 0.5
					}
				]
			},
			options: {
				indexAxis: 'y',
				// Elements options apply to all of the options unless overridden in a dataset
				// In this case, we are setting the border of each horizontal bar to be 2px wide
				elements: {
					bar: {
						borderWidth: 1
					}
				},
				onClick(event, elements, chart) {
					if (elements.length > 0) {
						// Get the first element (only single click in this example)
						const element = elements[0];

						// Get the index of the clicked bar within the dataset
						const index = element.index;

						// Get the label of the clicked element (genre in this case)
						const clickedLabel = labels[index];

						console.log('Clicked label:', clickedLabel);
					}

					console.log({ event, elements, chart });
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
				responsive: true,
				plugins: {
					legend: false,
					title: {
						display: true,
						text: 'Watched By Genre / Theme',
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
