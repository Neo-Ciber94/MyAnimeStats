<script lang="ts">
	import StatSidebar from '$components/StatSidebar.svelte';
	import StatTabs from '$components/StatTabs.svelte';
	import type { ActionData, PageServerData } from './$types';
	import CalculateStatsButton from '$components/CalculateStatsButton.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import StairsLoader from '$components/loaders/StairsLoader.svelte';
	import { onMount } from 'svelte';

	export let data: PageServerData;
	export let form: ActionData;

	let loading = true;

	onMount(() => {
		loading = false;
	});
</script>

<PageTransition>
	<div class="flex flex-col md:flex-row h-full w-full grow">
		<StatSidebar />

		{#if loading}
			<div class="flex flex-row justify-center items-center h-[50vh] w-full text-white">
				<StairsLoader size={30} class="text-violet-500" />
			</div>
		{:else if data.data?.stats}
			{@const result = data.data}
			<StatTabs stats={result.stats} animeList={result.animeList} />
		{:else if form?.data.stats}
			{@const result = form.data}
			<StatTabs stats={result.stats} animeList={result.animeList || []} />
		{:else}
			<div class="w-full flex flex-row justify-center mt-[10%] h-fit mb-20">
				<CalculateStatsButton>Calculate Stats</CalculateStatsButton>
			</div>
		{/if}
	</div>
</PageTransition>
