<script lang="ts">
	import session from '$stores/session';
	import { MALClient } from '@/lib/myanimelist/api';
	import type { WatchStatus } from '@/lib/myanimelist/common/types';
	import { Select, Spinner } from 'flowbite-svelte';

	const watchStatuses = [
		{ value: 'watching', name: 'Watching' },
		{ value: 'completed', name: 'Completed' },
		{ value: 'on_hold', name: 'On Hold' },
		{ value: 'dropped', name: 'Dropped' },
		{ value: 'plan_to_watch', name: 'Plan to Watch' }
	];

	const scoreText = [
		'Appalling',
		'Horrible',
		'Very Bad',
		'Bad',
		'Average',
		'Fine',
		'Good',
		'Very Good',
		'Great',
		'Masterpiece'
	];

	export let numEpisodes: number;
	export let animeId: number;

	// User status
	export let status: WatchStatus = 'watching';
	export let episodesSeen: number = 1;
	export let myScore: number = 6;

	let loading = false;
	let isSubmitting = false;

	function* range(max: number) {
		for (let i = 0; i < max; i++) {
			yield i;
		}
	}

	async function onSubmit() {
		if (isSubmitting) {
			return;
		}

		if ($session.accessToken == null) {
			throw new Error('user is not logged in');
		}

		isSubmitting = true;
		loading = true;

		try {
			const malClient = new MALClient({
				accessToken: $session.accessToken,
				proxyUrl: '/api/myanimelist',
			});

			await malClient.updateMyAnimeListStatus(animeId, {
				score: myScore,
				status: status,
				num_watched_episodes: episodesSeen
			});
		} catch (err: any) {
			const message = typeof err.message === 'string' ? err.message : 'Something went wrong';
			console.error(err);
			alert(message);
		} finally {
			isSubmitting = false;
			loading = false;
		}
	}
</script>

<form class="flex flex-col gap-2" on:submit|preventDefault={onSubmit}>
	<div class="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
		<div class="basis-3/12 text-orange-500">Status</div>
		<Select
			items={watchStatuses}
			placeholder="Choose the status"
			class="rounded-lg text-white bg-gray-900 text-sm"
			bind:value={status}
		/>
	</div>

	<div class="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-4 sm:mt-0 sm:items-center">
		<div class="basis-3/12 text-orange-500">Episodes</div>

		<div class="flex flex-col w-full">
			<div class="flex flex-row w-full gap-2 items-center">
				<div class="w-full flex-flex-col">
					{#if numEpisodes > 0}
						<input
							type="range"
							class="w-full rounded-lg accent-violet-500 mt-2"
							step={1}
							min={1}
							max={numEpisodes}
							bind:value={episodesSeen}
						/>

						<div class="flex flex-row justify-between text-violet-300 mx-1 text-[6px]">
							{#each range(numEpisodes) as i}
								<span>|</span>
							{/each}
						</div>
					{:else}
						<input
							type="range"
							class="w-full rounded-lg accent-violet-500 mt-2"
							step={1}
							min={0}
							max={1}
							value={1}
							on:input|preventDefault
						/>
					{/if}
				</div>

				<input
					type="number"
					class="rounded-lg h-8 text-white bg-gray-900 text-md"
					step={1}
					min={1}
					max={numEpisodes == 0 ? 10_000 : numEpisodes}
					bind:value={episodesSeen}
				/>
			</div>
		</div>
	</div>

	<div class="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-4 sm:mt-0 sm:items-center">
		<div class="basis-3/12 text-orange-500">Score</div>

		<div class="flex flex-col w-full">
			<div class="flex flex-row w-full items-center gap-2">
				<div class="flex flex-col w-full">
					<input
						type="range"
						class="w-full rounded-lg accent-orange-500 mt-2"
						step={1}
						min={1}
						max={10}
						bind:value={myScore}
					/>

					<div class="flex flex-row justify-between text-amber-500 mx-1 text-[6px]">
						{#each range(10) as i}
							<span>|</span>
						{/each}
					</div>
				</div>

				<input
					type="number"
					class="rounded-lg h-8 text-white bg-gray-900 text-md"
					step={1}
					min={1}
					max={10}
					bind:value={myScore}
				/>
			</div>

			<div class="w-full flex flex-row justify-end mt-2">
				<div
					data-score={myScore}
					class=" py-1 px-2 rounded-lg text-[12px]
                    shadow-lg min-w-[105px] max-w-fit text-center"
				>
					{scoreText[myScore - 1]}
				</div>
			</div>
		</div>
	</div>

	<div class="w-full text-center mt-12">
		<button
			disabled={loading}
			class={`w-full py-2 text-md font-semibold shadow-xl rounded-lg
				bg-orange-500 hover:bg-orange-600 text-white flex flex-row justify-center gap-2 items-center`}
		>
			{#if loading}
				<Spinner bg="bg-transparent" size="4" />
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="white"
						d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z"
					/></svg
				>
			{/if}
			<span>Save</span>
		</button>
	</div>
</form>

<style lang="postcss">
	[data-score='10'] {
		@apply bg-violet-600 text-white;
	}

	[data-score='9'] {
		@apply bg-violet-800 text-white;
	}

	[data-score='8'] {
		@apply bg-indigo-500 text-white;
	}

	[data-score='7'] {
		@apply bg-indigo-700 text-white;
	}

	[data-score='6'] {
		@apply bg-amber-400 text-black;
	}

	[data-score='5'] {
		@apply bg-amber-500 text-black;
	}

	[data-score='4'] {
		@apply bg-amber-700 text-white;
	}

	[data-score='3'] {
		@apply bg-orange-500 text-white;
	}

	[data-score='2'] {
		@apply bg-red-700 text-white;
	}

	[data-score='1'] {
		@apply bg-red-800 text-white;
	}
</style>
