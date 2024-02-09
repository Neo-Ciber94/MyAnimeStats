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
	import myStatsLoading from '$stores/myStatsLoading';
	import { fade } from 'svelte/transition';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import toast from 'svelte-french-toast';
	import type { UserStats } from '@/lib/server/services/userStatsService';

	export let data: PageServerData;
	export let form: ActionData;

	let loading = true;

	// onMount(() => {
	// 	loading = false;
	// });

	onMount(async () => {
		if (result.canRecalculate) {
			try {
				const res = await fetch('/api/stats/calculate', {
					method: 'POST',
					body: JSON.stringify({
						userName: data.data.user.name
					})
				});

				if (!res.ok) {
					toast.error('Failed to calculate user stats');
				}

				const updatedStats = (await res.json()) as UserStats;
				data.data.animeList = updatedStats.animeList;
				data.data.stats = updatedStats.userStats.stats;
				data.data.lastUpdated = updatedStats.userStats.lastUpdated;
				data.data.canRecalculate = false;
			} catch (err) {
				console.error(err);
			} finally {
				loading = false;
			}
		} else {
			loading = false;
		}
	});

	function onSubmit(e: CustomEvent<Record<string, unknown>>) {
		data = e.detail as PageServerData;
	}

	const userId = data.data?.user.id;
	$: isCurrentUser = userId && $session.user?.id === userId;
	$: result = data.data || form?.data || null;
	$: needsReviewCount = (result?.animeList || []).filter((x) => AnimeHelper.needsReview(x)).length;
</script>

<SEO title="MyStats" />

<PageTransition>
	<div class="flex flex-col md:flex-row h-full w-full grow">
		<StatSidebar user={result?.user ?? null} needsReview={needsReviewCount} />

		<div class="relative w-full">
			{#if loading || $myStatsLoading}
				<div class="flex flex-row justify-center items-center h-[50vh] w-full text-white">
					<CubesLoader size={30} class="text-violet-500" />
				</div>
			{:else if result.stats && result.animeList}
				<div class="w-full h-full" transition:fade={{ duration: 200 }}>
					<StatTabs stats={result.stats} animeList={result.animeList} user={result.user}>
						<div slot="me-footer">
							{#if isCurrentUser}
								<div
									class="w-10/12 mx-auto flex flex-row justify-center mt-[10%]
										h-fit mb-20 border-2 border-violet-700 rounded-lg py-10"
								>
									<CalculateStatsButton on:data={onSubmit}>
										<span class="text-sm md:text-lg">Re-Calculate Stats</span>
									</CalculateStatsButton>
								</div>
							{/if}

							<div class="mb-10" />
						</div>
					</StatTabs>
				</div>
			{:else}
				<div class="flex flex-col gap-3 justify-center p-4 w-full items-center">
					<div
						class="w-full flex flex-row justify-center items-center opacity-70
					flex-wrap text-center mt-[10%] h-fit mb-20 gap-4 text-violet-300"
					>
						<InboxSolid class="w-8 h-8" />

						{#if isCurrentUser}
							<span class="text-lg md:text-2xl"> Your stats had not been calculated </span>
						{:else}
							<span class="text-lg md:text-2xl"> User stats had not been calculated </span>
						{/if}
					</div>

					{#if dev || isCurrentUser}
						<CalculateStatsButton on:data={onSubmit}>
							<span class="text-sm md:text-lg">Calculate Stats</span>
							{#if dev && !isCurrentUser}
								<span>{` (DEV)`}</span>
							{/if}
						</CalculateStatsButton>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</PageTransition>
