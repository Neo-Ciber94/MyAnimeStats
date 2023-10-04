<script lang="ts">
	import ConfirmDialog from '$components/ConfirmDialog.svelte';
	import session from '$stores/session';
	import { MALClient } from '@animelist/client';
	import type { AnimeObject, WatchStatus } from '@/lib/myanimelist/common/types';
	import cx from '@/lib/utils/cx';
	import { numberRange } from '@/lib/utils/helpers';
	import Color from 'color';
	import { Select, Spinner } from 'flowbite-svelte';
	import { CheckSolid, ChevronRightSolid, EyeSolid, TrashBinSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let watchStatuses: { value: WatchStatus; name: string }[] = [];

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
	export let anime: AnimeObject;
	export let canDelete = true;

	const dispatch = createEventDispatcher<{
		delete: void;
		save: void;
	}>();

	// User status
	export let status: WatchStatus | undefined = 'plan_to_watch';
	export let episodesSeen: number = 1;
	export let myScore: number = 6;

	let loading = false;
	let isSubmitting = false;
	let isDeleting = false;

	onMount(() => {
		switch (anime.node.status) {
			case 'not_yet_aired': {
				watchStatuses = [
					{ value: 'on_hold', name: 'On Hold' },
					{ value: 'plan_to_watch', name: 'Plan to Watch' }
				];

				if (!status) {
					status = 'plan_to_watch';
				}

				break;
			}
			case 'currently_airing': {
				watchStatuses = [
					{ value: 'watching', name: 'Watching' },
					{ value: 'on_hold', name: 'On Hold' },
					{ value: 'dropped', name: 'Dropped' },
					{ value: 'plan_to_watch', name: 'Plan to Watch' }
				];

				if (!status) {
					status = 'watching';
				}

				break;
			}
			case 'finished_airing': {
				watchStatuses = [
					{ value: 'watching', name: 'Watching' },
					{ value: 'completed', name: 'Completed' },
					{ value: 'on_hold', name: 'On Hold' },
					{ value: 'dropped', name: 'Dropped' },
					{ value: 'plan_to_watch', name: 'Plan to Watch' }
				];

				if (!status) {
					status = 'watching';
				}

				break;
			}
		}
	});

	async function onSave() {
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
				proxyUrl: '/api'
			});

			await malClient.updateMyAnimeListStatus(anime.node.id, {
				score: myScore,
				status: status,
				num_watched_episodes: episodesSeen
			});

			toast.success('Your anime list was updated');
			dispatch('save');
		} catch (err: any) {
			const message = typeof err.message === 'string' ? err.message : 'Something went wrong';
			console.error(err);
			toast.error(message);
		} finally {
			isSubmitting = false;
			loading = false;
		}
	}

	async function onDelete(event: MouseEvent) {
		event.stopPropagation();
		isDeleting = true;
	}

	async function onConfirmDelete(event: CustomEvent<{ close: () => void }>) {
		if ($session.accessToken == null) {
			throw new Error('user is not logged in');
		}

		loading = true;

		try {
			const malClient = new MALClient({
				accessToken: $session.accessToken,
				proxyUrl: '/api'
			});

			await malClient.deleteMyAnimeListStatus(anime.node.id);
			toast.success('Anime was deleted from your list');
			dispatch('delete');
			isDeleting = false;
			event.detail.close();
		} catch (err: any) {
			const message = typeof err.message === 'string' ? err.message : 'Something went wrong';
			console.error(err);
			toast.error(message);
		} finally {
			isSubmitting = false;
			loading = false;
		}
	}

	$: episodeRangeColor = (function () {
		const factor = numEpisodes > 0 ? (episodesSeen / numEpisodes) * 0.3 : 0;
		return Color('#c084fc').darken(factor).toString();
	})();

	$: scoreRangeColor = (function () {
		const factor = (myScore / 10) * 0.2;
		return Color('#fb923c')
			.darken(factor)
			.rotate(factor * -45)
			.toString();
	})();
</script>

<ConfirmDialog
	closeOnConfirm={false}
	isOpen={isDeleting}
	class=" w-11/12 sm:w-[400px] px-2"
	on:cancel={() => (isDeleting = false)}
	on:confirm={onConfirmDelete}
>
	<div class="pb-4 pt-4 px-1 sm:px-4">
		<span>
			Remove
			<span class="text-pink-400">{anime.node.title}</span>
			from your anime list?
		</span>
	</div>

	<span slot="confirm" class="flex flex-row gap-2 items-center">
		{#if loading && isDeleting}
			<Spinner bg="bg-transparent" size="4" />
		{/if}

		Remove
	</span>
</ConfirmDialog>

<div class="flex flex-col gap-1">
	<div class="flex flex-col gap-1 sm:gap-2">
		<div class="basis-3/12 text-orange-500">
			<span class="flex flex-row gap-2">
				<ChevronRightSolid class="outline-none" />
				Status
			</span>
		</div>
		<Select
			items={watchStatuses}
			placeholder="Choose the status"
			class="rounded-lg text-white bg-gray-900 text-sm"
			bind:value={status}
		/>
	</div>

	{#if status !== 'plan_to_watch'}
		<div class="flex flex-col mt-4">
			<div class="basis-3/12 text-orange-500">
				<span class="flex flex-row gap-2">
					<EyeSolid class="outline-none" />
					Episodes
				</span>
			</div>

			<div class="flex flex-col w-full">
				<div class="flex flex-col xs:flex-row w-full gap-2 items-center">
					<div class="w-full flex-flex-col">
						{#if numEpisodes > 0}
							<input
								type="range"
								class="custom-range"
								step={1}
								min={1}
								max={numEpisodes}
								bind:value={episodesSeen}
								style={`--range-color: ${episodeRangeColor};`}
							/>

							<div class="flex flex-row justify-between text-violet-300 mx-1 text-[4px]">
								{#each numberRange(numEpisodes) as i}
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
						class="rounded-lg h-8 w-full xs:w-auto text-white bg-gray-900 text-md"
						step={1}
						min={1}
						max={numEpisodes == 0 ? 10_000 : numEpisodes}
						bind:value={episodesSeen}
					/>
				</div>
			</div>
		</div>

		<div class="flex flex-col mt-4">
			<div class="basis-3/12 text-orange-500">
				<div class="flex flex-row gap-2 justify-between mb-2">
					<span class="flex flex-row gap-2">
						<CheckSolid class="outline-none" />
						Score
					</span>

					<span
						class={cx(
							'flex flex-row items-center font-semibold justify-center text-base px-2 w-[110px] text-orange-500',
							{
								'masterpiece-background': myScore === 10
							}
						)}
					>
						{scoreText[myScore - 1]}
					</span>
				</div>
			</div>

			<div class="flex flex-col w-full">
				<div class="flex flex-col xs:flex-row w-full items-center gap-2">
					<div class="flex flex-col w-full">
						<input
							type="range"
							class="custom-range"
							step={1}
							min={1}
							max={10}
							bind:value={myScore}
							style={`--range-color: ${scoreRangeColor};`}
						/>

						<div class="flex flex-row justify-between text-amber-500 mx-1 text-[4px] mt-1">
							{#each numberRange(10) as _i}
								<span>|</span>
							{/each}
						</div>
					</div>

					<input
						type="number"
						class="rounded-lg h-8 w-full xs:w-auto text-white bg-gray-900 text-md"
						step={1}
						min={1}
						max={10}
						bind:value={myScore}
					/>
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full flex flex-col-reverse sm:flex-row gap-2 text-center mt-6">
		<button
			disabled={loading || isDeleting}
			on:click={onSave}
			class={`w-full py-2 text-md font-semibold shadow-xl rounded-lg transition duration-200
				border-2 border-violet-500 hover:border-violet-600 text-violet-400 hover:text-violet-600 
				flex flex-row justify-center gap-2 items-center`}
		>
			{#if loading}
				<Spinner bg="bg-transparent" size="4" />
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z"
					/></svg
				>
			{/if}
			<span>Save</span>
		</button>

		{#if canDelete}
			<button
				disabled={loading || isDeleting}
				on:click={onDelete}
				class={`w-full py-2 text-md font-semibold shadow-xl rounded-lg
				border-2 border-red-500 hover:border-red-600
				text-red-500 hover:text-red-700  flex flex-row justify-center gap-2 items-center`}
			>
				<TrashBinSolid />
				<span>Delete</span>
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	input[type='range'].custom-range {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		cursor: pointer;
		outline: none;
		overflow: hidden;
		border-radius: 16px;
	}

	input[type='range'].custom-range::-webkit-slider-runnable-track {
		height: 15px;
		background: #ccc;
		border-radius: 16px;
	}

	input[type='range'].custom-range::-moz-range-track {
		height: 15px;
		background: #ccc;
		border-radius: 16px;
	}

	input[type='range'].custom-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 15px;
		width: 15px;
		background-color: #fff;
		border-radius: 50%;
		border: 2px solid var(--range-color, #f50);
		box-shadow: -1007px 0 0 1000px var(--range-color, #f50);
	}

	input[type='range'].custom-range::-moz-range-thumb {
		height: 15px;
		width: 15px;
		background-color: #fff;
		border-radius: 50%;
		border: 1px solid var(--range-color, #f50);
		box-shadow: -1007px 0 0 1000px var(--range-color, #f50);
	}

	.masterpiece-background {
		background: linear-gradient(-45deg, #f97316, #ec4899, #c084fc, #2dd4bf);
		background-size: 400% 400%;
		animation: gradient 5s ease infinite;
		@apply text-transparent bg-clip-text;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
