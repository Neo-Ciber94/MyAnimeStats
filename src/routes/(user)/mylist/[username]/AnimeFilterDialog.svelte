<script context="module" lang="ts">
	import type { AnimeSeason, WatchStatus } from '@/lib/myanimelist/common/types';

	export type UserWatchStatus = WatchStatus | 'needs_review';

	type Filters = {
		year?: number;
		season?: AnimeSeason;
		status?: UserWatchStatus;
	};
</script>

<script lang="ts">
	import AlertDialog from '$components/AlertDialog.svelte';
	import SelectList, { type SelectItem } from '$components/SelectList.svelte';
	import { CloseButton } from 'flowbite-svelte';
	import {
		CalendarMonthSolid,
		CalendarWeekSolid,
		FilterOutline,
		QuestionCircleSolid
	} from 'flowbite-svelte-icons';
	import Enumerable from 'linq';
	import { onMount } from 'svelte';

	export let isOpen: boolean;
	export let years: number[];

	// filters
	export let year: number | undefined = undefined;
	export let season: AnimeSeason | undefined = undefined;
	export let status: UserWatchStatus | undefined = undefined;

	let tempFilters: Filters = {
		year,
		season,
		status
	};

	onMount(() => {
		tempFilters = {
			year,
			season,
			status
		};
	});

	const yearItems = (function () {
		const _yearItems: SelectItem<number | undefined>[] = Enumerable.from(years)
			.select((x) => ({ label: String(x), value: x }))
			.toArray();

		_yearItems.splice(0, 0, {
			label: 'Any year',
			value: undefined
		});

		return _yearItems;
	})();

	const seasonItems: SelectItem<AnimeSeason | undefined>[] = [
		{ label: 'Any season', value: undefined },
		{ label: 'Spring', value: 'spring' },
		{ label: 'Summer', value: 'summer' },
		{ label: 'Fall', value: 'fall' },
		{ label: 'Winter', value: 'winter' },
	];

	const statusItems: SelectItem<UserWatchStatus | undefined>[] = [
		{ label: 'Any status', value: undefined },
		{ label: 'Completed', value: 'completed' },
		{ label: 'Watching', value: 'watching' },
		{ label: 'On Hold', value: 'on_hold' },
		{ label: 'Plan to Watch', value: 'plan_to_watch' },
		{ label: 'Needs Review', value: 'needs_review' }, 
		{ label: 'Dropped', value: 'dropped' }, 
	];

	function handleFilter() {
		year = tempFilters.year;
		season = tempFilters.season;
		status = tempFilters.status;
		isOpen = false;
	}
</script>

<AlertDialog {isOpen} on:close={() => (isOpen = false)}>
	<div
		class="px-4 pt-2 pb-4 bg-gray-900 rounded-lg flex flex-col border-2 border-violet-500 w-[90vw] lg:w-auto lg:min-w-[40vw]"
	>
		<div class="flex flex-row text-orange-500 gap-2 mt-2">
			<FilterOutline class="outline-none" />
			<span>Filters</span>
		</div>

		<div class="py-4 flex flex-col gap-2">
			<SelectList items={yearItems} bind:selected={tempFilters.year}>
				<div slot="selected" let:selectedItem class="flex flex-row items-center w-full">
					<div class="flex flex-row gap-3">
						<CalendarMonthSolid class="text-violet-500" />
						<span>{selectedItem.label}</span>
					</div>
					{#if tempFilters.year}
						<CloseButton
							class="text-red-500 ml-auto focus:ring-0 hover:bg-transparent hover:text-red-700"
							on:click={(e) => {
								e.stopPropagation();
								tempFilters.year = undefined;
							}}
						/>
					{/if}
				</div>
			</SelectList>

			<SelectList items={seasonItems} bind:selected={tempFilters.season}>
				<div slot="selected" let:selectedItem class="flex flex-row items-center w-full">
					<div class="flex flex-row gap-3">
						<CalendarWeekSolid class="text-violet-500" />
						<span>{selectedItem.label}</span>
					</div>
					{#if tempFilters.season}
						<CloseButton
							class="text-red-500 ml-auto focus:ring-0 hover:bg-transparent hover:text-red-700"
							on:click={(e) => {
								e.stopPropagation();
								tempFilters.season = undefined;
							}}
						/>
					{/if}
				</div>
			</SelectList>

			<SelectList items={statusItems} bind:selected={tempFilters.status}>
				<div slot="selected" let:selectedItem class="flex flex-row items-center w-full">
					<div class="flex flex-row gap-3">
						<QuestionCircleSolid class="text-violet-500" />
						<span>{selectedItem.label}</span>
					</div>
					{#if tempFilters.status}
						<CloseButton
							class="text-red-500 ml-auto focus:ring-0 hover:bg-transparent hover:text-red-700"
							on:click={(e) => {
								e.stopPropagation();
								tempFilters.status = undefined;
							}}
						/>
					{/if}
				</div>
			</SelectList>
		</div>

		<div class="flex flex-row mt-auto gap-2 justify-end">
			<button
				on:click={handleFilter}
				class="text-violet-500 px-4 py-2 min-w-[100px] hover:bg-violet-500/10 rounded-lg"
			>
				Filter
			</button>
			<button
				on:click={() => (isOpen = false)}
				class="text-red-500 px-4 py-2 min-w-[100px] hover:bg-red-500/10 rounded-lg"
			>
				Cancel
			</button>
		</div>
	</div>
</AlertDialog>
