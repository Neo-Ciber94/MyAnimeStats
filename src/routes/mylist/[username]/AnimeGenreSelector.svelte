<script lang="ts">
	import type { AutocompleteItem } from '$components/Autocomplete.svelte';
	import TagInput from '$components/TagInput.svelte';
	import type { Genre } from '@/lib/myanimelist/common/types';
	import { ListSolid } from 'flowbite-svelte-icons';

	export let genres: Genre[];
	export let selected: Genre[];

	$: items = genres.map((x) => ({
		label: x.name,
		value: x
	})) satisfies AutocompleteItem<Genre>[];
</script>

<TagInput
	placeholder="Genres..."
	{items}
	{selected}
	on:change
	listClass="backdrop-blur-lg border-violet-500 bg-gray-900/70"
	class="gap-2 bg-transparent  focus-within:border-b-orange-500 text-white border-b-2 pb-2 border-b-violet-500"
>
	<div slot="icon" class="mx-2">
		<ListSolid class="text-orange-500 !outline-none" />
	</div>

	<div
		let:item
		let:active
		slot="option"
		class={`py-2 pl-4 w-full h-full text-left bg-transparent text-white hover:bg-violet-500 ${
			active ? 'bg-violet-600' : ''
		}`}
	>
		{item.label}
	</div>
</TagInput>
