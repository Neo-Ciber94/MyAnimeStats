<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartDataset } from 'chart.js';
	import type { AnimeObject, Genre } from '@/lib/myanimelist/common/types';
	import Enumerable from 'linq';
	import Color from 'color';

	export let animeList: AnimeObject[];
	export let graphTitle: string;
	export let maxSize: number | undefined = undefined;

	let chartCanvas: HTMLCanvasElement;

	function getGraphData() {
		const animeGroupByGenre = Enumerable.from(animeList)
			.selectMany(
				(anime) => anime.node.genres || [],
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

		const borderColors = [...Array(10).keys()].map((x) =>
			Color('rgb(153, 102, 255)')
				.darken(Math.random() * 0.3)
				.lighten(Math.random() * 0.2)
				.fade(0.2)
		);
		const backgroundColors = borderColors.map((x) => x.fade(0.7));

		const datasets: ChartDataset<'bar'>[] = [
			{
				label: 'Count',
				data: data,
				backgroundColor: backgroundColors.map((x) => x.toString()),
				borderColor: borderColors.map((x) => x.toString()),
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
