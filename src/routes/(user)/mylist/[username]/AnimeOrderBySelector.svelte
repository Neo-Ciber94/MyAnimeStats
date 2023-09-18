<script context="module" lang="ts">
	export const animeOrderBySchema = z.enum([
		'my_score_asc',
		'my_score_desc',
		'score_asc',
		'score_desc',
		'rank_asc',
		'rank_desc'
	]);
	export type AnimeOrderBy = z.infer<typeof animeOrderBySchema>;
</script>

<script lang="ts">
	import type { AutocompleteItem } from '$components/Autocomplete.svelte';
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption
	} from '@rgossiaux/svelte-headlessui';
	import { SortVerticalSolid } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import { z } from 'zod';

	export let selected: AnimeOrderBy | undefined;

	const items: AutocompleteItem<AnimeOrderBy>[] = [
		{ label: 'Score Descending', value: 'my_score_desc' },
		{ label: 'Score Ascending', value: 'my_score_asc' },
		{ label: 'User Score Descending', value: 'score_desc' },
		{ label: 'User Score Ascending', value: 'score_asc' },
		{ label: 'Rank Descending', value: 'rank_desc' },
		{ label: 'Rank Ascending', value: 'rank_asc' },
	];

	$: selectedItem = items.find((x) => x.value === selected) || items[0];
</script>

<div class="w-full flex flex-row items-center">
	<Listbox bind:value={selected} let:open class="z-10 w-full relative py-4">
		<ListboxButton
			class="text-base flex flex-row text-start text-gray-200 border-b-2 pb-2 border-b-violet-500 w-full"
		>
			<SortVerticalSolid class="text-orange-500 mr-4 outline-none" />
			<span>{selectedItem.label}</span>
		</ListboxButton>
		{#if open}
			<div transition:fade={{ duration: 100 }}>
				<ListboxOptions
					static
					class="mt-2 absolute rounded-md border-2 border-violet-600 bg-gray-900/70 backdrop-blur-lg w-full"
				>
					{#each items as item (item.value)}
						<ListboxOption
							value={item.value}
							class={`text-white hover:bg-violet-500 w-full py-2 px-4 cursor-pointer
                            ${item.value === selectedItem.value ? 'bg-violet-500' : ''} `}
						>
							{item.label}
						</ListboxOption>
					{/each}
				</ListboxOptions>
			</div>
		{/if}
	</Listbox>
</div>
