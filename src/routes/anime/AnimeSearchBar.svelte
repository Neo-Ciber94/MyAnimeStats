<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';

	const dispatch = createEventDispatcher<{
		search: string;
	}>();

	function handleSearch(value: string) {
		dispatch('search', value);
	}
</script>

<div class="flex flex-row gap-2">
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

<!-- <form on:submit={handleSubmit} class="flex flex-col gap-2">
	<div class="flex flex-row gap-2">
		<input
			required
			name="q"
			placeholder="Name..."
			minlength="3"
			type="search"
			class="w-full h-12 rounded-lg shadow-lg bg-gray-950 border-2 text-white border-violet-600 px-4 py-2
        !focus:outline-none focus:border-2 focus:border-pink-600 transition duration-200"
			{...$$restProps}
		/>

		<button type="submit" class="rounded-lg px-8 py-2 text-base text-white bg-pink-600"
			>Search</button
		>
	</div>

	<div class="flex flex-row gap-2">
		<select
			name="season"
			bind:value={season}
			class="appearance-none border-none w-full focus:border-white rounded-lg px-4 py-2 text-sm accent-white"
		>
			<option class="bg-white text-black" value="">Any Season</option>
			<option class="bg-white text-black" value="winter">Winter</option>
			<option class="bg-white text-black" value="spring">Spring</option>
			<option class="bg-white text-black" value="summer">Summer</option>
			<option class="bg-white text-black" value="fall">Fall</option>
		</select>

		<input
			name="year"
			placeholder="Any Year"
			bind:value={year}
			type="number"
			max={new Date().getFullYear()}
			class="rounded-lg text-sm w-full"
		/>

		<select
			name="genre"
			class="appearance-none border-none w-full focus:border-white rounded-lg px-4 py-2 text-sm accent-white"
		>
			<option class="bg-white text-black" value={''}>Any Genre</option>

			{#each animeGenres as genre}
				<option class="bg-white text-black" value={genre.id}>{genre.name}</option>
			{/each}
		</select>
	</div>
</form> -->
