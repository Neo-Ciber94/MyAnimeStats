<script>
	import { goto } from '$app/navigation';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { twMerge } from 'tailwind-merge';

	let search = '';

	function goToSearch() {
		goto(`/anime?q=${search}`);
	}
</script>

<div class={twMerge('flex flex-row relative h-8 w-full', $$restProps.class)}>
	<input
		placeholder="Search anime..."
		class="pl-4 pr-10 py-1 w-full mx-2 bg-gray-950 border-2 text-white rounded-lg
        border-none outline-none ring-2 ring-violet-500 focus:ring-pink-600"
		bind:value={search}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				goToSearch();
			}
		}}
	/>

	<button
		class="absolute h-full w-10 bg-white/0 right-2 text-violet-400 hover:text-pink-600
        flex flex-row justify-center items-center"
		on:click={goToSearch}
	>
		<SearchOutline size="sm" class=" outline-none" />
	</button>
</div>
