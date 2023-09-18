<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import CalculateStatsButton from '@/routes/(user)/mystats/[username]/CalculateStatsButton.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import CubesLoader from '$components/loaders/CubesLoader.svelte';
	import StatSidebar from './StatSidebar.svelte';
	import StatTabs from './StatTabs.svelte';
	import { onMount } from 'svelte';
	import SEO from '$components/SEO.svelte';
	import { InboxSolid } from 'flowbite-svelte-icons';
	import session from '$stores/session';
	import { dev } from '$app/environment';

	export let data: PageServerData;
	export let form: ActionData;

	let loading = true;

	onMount(() => {
		loading = false;
	});

	$: result = data.data || form?.data || null;
</script>

<SEO title="MyStats" />

<PageTransition>
	<div class="flex flex-col md:flex-row h-full w-full grow">
		<StatSidebar user={result?.user ?? null} />

		{#if loading}
			<div class="flex flex-row justify-center items-center h-[50vh] w-full text-white">
				<CubesLoader size={30} class="text-violet-500" />
			</div>
		{:else if result}
			<StatTabs stats={result.stats} animeList={result.animeList} user={result.user}>
				<div slot="me-footer">
					{#if result.canRecalculate && $session.user?.id === result.user.id}
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
				</div>
			</StatTabs>
		{:else}
			<div class="flex flex-col gap-3 justify-center p-4 w-full items-center">
				<div
					class="w-full flex flex-row justify-center items-center opacity-70
				flex-wrap text-center mt-[10%] h-fit mb-20 gap-4 text-violet-300"
				>
					<InboxSolid class="w-8 h-8" />

					<span class="text-lg md:text-2xl"> User stats had not been calculated </span>
				</div>

				<!-- This button will never be visible for an user -->
				{#if dev}
					<CalculateStatsButton>
						<span class="text-sm md:text-lg">Re-Calculate Stats (DEV)</span>
					</CalculateStatsButton>
				{/if}
			</div>
		{/if}
	</div>
</PageTransition>
