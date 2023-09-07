<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartDataset } from 'chart.js';
	import type { AnimeObject, Genre } from '@/lib/myanimelist/common/types';
	import Enumerable from 'linq';

	export let animeList: AnimeObject[];
	export let graphTitle: string;
	export let maxSize: number | undefined = undefined;

	let chartCanvas: HTMLCanvasElement;

	function getGraphData() {
		const animeGroupByGenre = Enumerable.from(animeList)
			.selectMany(
				(anime) => anime.node.genres,
				(anime, genre: Genre) => ({ anime, genre })
			)
			.groupBy(
				(x) => x.genre.name,
				(x) => x.anime
			)
			.toDictionary(
				(group) => group.key(),
				(group) => group.toArray()
			)
			.toEnumerable()
			.orderByDescending((x) => x.value.length)
			.take(maxSize ?? Number.MAX_SAFE_INTEGER)
			.toArray();

		const labels = animeGroupByGenre.map((x) => x.key);
		const data = animeGroupByGenre.map((x) => x.value.length);

		const datasets: ChartDataset<'bar'>[] = [
			{
				label: 'Count',
				data: data,
				backgroundColor: ['rgba(153, 102, 255, 0.2)'],
				borderColor: ['rgb(153, 102, 255)'],
				borderWidth: 1
			}
		];

		return { labels, datasets };
	}

	onMount(() => {
		Chart.register(...registerables);
		new Chart(chartCanvas, {
			type: 'bar',
			data: getGraphData(),
			options: {
				maintainAspectRatio: false,
				responsive: true,
				indexAxis: 'y',
				scales: {
					y: {
						ticks: {
							color: 'white',
							autoSkip: false,
							font: {
								size: 15
							}
						}
					},
					x: {
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
						text: graphTitle,
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

<div class="w-11/12 flex flex-row justify-center mx-auto h-screen">
	<canvas bind:this={chartCanvas} />
</div>
