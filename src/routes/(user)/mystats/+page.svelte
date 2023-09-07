<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import CalculateStatsButton from '$components/CalculateStatsButton.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import CubesLoader from '$components/loaders/CubesLoader.svelte';
	import StatSidebar from './StatSidebar.svelte';
	import StatTabs from './StatTabs.svelte';
	import { onMount } from 'svelte';

	export let data: PageServerData;
	export let form: ActionData;

	let loading = true;

	onMount(() => {
		loading = false;
	});

	$: result = data.data || form?.data || null;
</script>

<PageTransition>
	<div class="flex flex-col md:flex-row h-full w-full grow">
		<StatSidebar />

		{#if loading}
			<div class="flex flex-row justify-center items-center h-[50vh] w-full text-white">
				<CubesLoader size={30} class="text-violet-500" />
			</div>
		{:else if result}
			<StatTabs stats={result.stats} animeList={result.animeList}>
				{#if result.canRecalculate}
					<div
						class="w-10/12 mx-auto flex flex-row justify-center mt-[10%]
							h-fit mb-20 border-2 border-violet-700 rounded-lg py-10"
					>
						<CalculateStatsButton>
							<span class="text-sm md:text-lg">Re-Calculate Stats</span>
						</CalculateStatsButton>
					</div>
				{/if}

				<div class="mb-10" />
			</StatTabs>
		{:else}
			<div class="w-full flex flex-row justify-center mt-[10%] h-fit mb-20">
				<span class="text-sm md:text-lg">Calculate Stats</span>
			</div>
		{/if}
	</div>
</PageTransition>
