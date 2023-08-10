<script lang="ts">
	import StatSidebar from '$components/StatSidebar.svelte';
	import StatTabs from '$components/StatTabs.svelte';
	import { ChartSolid } from 'flowbite-svelte-icons';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from 'flowbite-svelte';
	import CalculateStatsButton from '$components/CalculateStatsButton.svelte';

	export let data: PageServerData;
	export let form: ActionData;
</script>

<div class="flex flex-col md:flex-row h-full w-full grow">
	<StatSidebar />

	{#if data?.stats}
		<StatTabs stats={data.stats} animeList={data.animeList} />
	{:else if form?.stats}
		<StatTabs stats={form.stats} animeList={data.animeList || []} />
	{:else}
		<div class="w-full flex flex-row justify-center mt-[10%] h-fit mb-20">
			<CalculateStatsButton>Calculate Stats</CalculateStatsButton>
		</div>
	{/if}
</div>
