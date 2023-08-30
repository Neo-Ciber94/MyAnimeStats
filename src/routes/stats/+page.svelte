<script lang="ts">
	import StatSidebar from '$components/StatSidebar.svelte';
	import StatTabs from '$components/StatTabs.svelte';
	import type { ActionData, PageServerData } from './$types';
	import CalculateStatsButton from '$components/CalculateStatsButton.svelte';
	import PageTransition from '$components/PageTransition.svelte';

	export let data: PageServerData;
	export let form: ActionData;
</script>

<PageTransition>
	<div class="flex flex-col md:flex-row h-full w-full grow">
		<StatSidebar />

		{#if data?.stats}
			<StatTabs stats={data.stats} animeList={data.animeList} />
		{:else if form?.stats}
			<StatTabs stats={form.stats} animeList={form.animeList || []} />
		{:else}
			<div class="w-full flex flex-row justify-center mt-[10%] h-fit mb-20">
				<CalculateStatsButton>Calculate Stats</CalculateStatsButton>
			</div>
		{/if}
	</div>
</PageTransition>
