<script lang="ts">
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import { onMount } from 'svelte';
	import { Chart, registerables, type ChartDataset, type BubbleDataPoint } from 'chart.js';
	import Color from 'color';
	import Enumerable from 'linq';

	export let popularAnimeList: AnimeObject[];
	export let referenceAnime: AnimeObject;

	let chartCanvas: HTMLCanvasElement;

	function getDatasets() {
		const excludeReferenceInDataset = popularAnimeList.some(
			(x) => x.node.id === referenceAnime.node.id
		);

		const datasets: ChartDataset<'bubble'>[] = [];

		const maxNumScoringUsers = Enumerable.from(popularAnimeList)
			.concat([referenceAnime])
			.max((x) => x.node.num_scoring_users);

		const rFactor = maxNumScoringUsers / 50;

        let i = 1;
		for (const anime of popularAnimeList) {
			datasets.push({
				label: anime.node.title,
				borderColor: Color('#a855f7').toString(),
				backgroundColor: Color('#a855f7')
					.darken(Math.random() * 0.5)
					.lighten(Math.random() * 0.5)
					.fade(0.5)
					.toString(),
				data: [
					{
						x: i++,
						y: anime.node.mean,
						r: Math.max(10, Math.ceil(anime.node.num_scoring_users / rFactor))
					}
				]
			});
		}

		if (!excludeReferenceInDataset) {
			datasets.push({
				label: referenceAnime.node.title,
				borderColor: Color('#db2777').toString(),
				backgroundColor: Color('#db2777').fade(0.5).toString(),
				data: [
					{
						x: 11,
						y: referenceAnime.node.mean,
						r: 10
					}
				]
			});
		}

		return datasets;
	}

	onMount(() => {
		Chart.register(...registerables);

		new Chart(chartCanvas, {
			type: 'bubble',
			data: { datasets: getDatasets() },
			options: {
				maintainAspectRatio: false,
				responsive: true,
				scales: {
					x: {
						ticks: {
							color: 'lightgray',
							autoSkip: true,
						}
					},
					y: {
						stacked: true,
						ticks: {
							color: 'lightgray',
							autoSkip: true,
							//maxTicksLimit: 6,
							stepSize: 1,
							callback: function (value, index, values) {
								const skipValues = [1, 2, 4, 5, 6, 7];
								if (skipValues.includes(Number(value))) {
									return ''; // Skip this tick value
								}
								return value; // Display the tick value
							}
						}
						//max: 10
					}
				},
				plugins: {
					legend: {
						labels: {
							color: 'white'
						}
					},
					title: {
						display: true,
						text: 'Most popular anime',
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
