<script lang="ts">
	import { FilterSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import AlertDialog from '$components/AlertDialog.svelte';

	export let value = '';

	let dialogElement: HTMLDialogElement;
	let isFiltersOpen = false;

	const dispatch = createEventDispatcher<{
		search: {
			q: string;
		};
	}>();

	function handleSearch(q: string) {
		dispatch('search', { q });
	}

	function handleOpenFilters() {
		isFiltersOpen = true;
	}
</script>

<div class="flex flex-col sm:flex-row gap-2">
	<input
		bind:value
		required
		name="q"
		placeholder="Search anime.."
		minlength="3"
		type="text"
		class="w-full h-12 rounded-lg bg-gray-950 text-white outline-none border-none
		transition duration-200 ring-2 ring-violet-600 focus:ring-pink-600 px-4 py-2"
		{...$$restProps}
	/>

	<button
		type="submit"
		class="rounded-lg px-8 py-2 text-base text-white bg-pink-600"
		on:click={() => handleSearch(value)}
	>
		Search
	</button>
</div>

<button
	on:click|stopPropagation={handleOpenFilters}
	class={`flex flex-row gap-1 text-white text-xs justify-start items-center rounded-md
		transition duration-200 max-w-fit px-5 py-[2px] mt-2
		${isFiltersOpen ? 'bg-pink-500 hover:bg-pink-600' : 'bg-violet-500 hover:bg-violet-600'} `}
>
	<FilterSolid size="xs" />
	<span>Filter</span>
</button>

<AlertDialog
	on:close={() => (isFiltersOpen = false)}
	isOpen={isFiltersOpen}
	dialogClass="bg-gray-900 p-4 rounded-lg border border-gray-300"
>
	<div class="text-white">Example dialog</div>
</AlertDialog>
