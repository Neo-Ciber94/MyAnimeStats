<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let value = '';
	export let placeholder: string | undefined = 'Search anime...';

	const dispatch = createEventDispatcher<{
		search: string;
	}>();

	function handleSearch(q: string) {
		dispatch('search', q);
	}
</script>

<div class="flex flex-col sm:flex-row gap-2">
	<input
		on:input
		bind:value
		required
		name="q"
		{placeholder}
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
