<script context="module" lang="ts">
	export type SelectItem<T> = {
		label: string;
		value: T;
	};
</script>

<script lang="ts" generics="T">
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption
	} from '@rgossiaux/svelte-headlessui';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let selected: T;
	export let items: SelectItem<T>[];

	$: selectedItem = items?.find((x) => x.value === selected) || items?.[0];

	const dispatch = createEventDispatcher<{ change: T }>();

	// According docs we can use any value: https://svelte-headlessui.goss.io/docs/2.0/listbox
	const asAny = (x: unknown) => x as any;
</script>

<div class="w-full flex flex-row items-center">
	<Listbox bind:value={selected} let:open class="w-full relative py-4">
		<ListboxButton
			class="text-base !z-0 flex flex-row text-start text-orange-300 border-b-2 pb-2 border-b-violet-500 w-full"
		>
			<slot name="selected" {selectedItem}>
				<span>{selectedItem.label}</span>
			</slot>
		</ListboxButton>
		{#if open}
			<div transition:fade={{ duration: 100 }}>
				<ListboxOptions
					static
					class={`mt-2 absolute rounded-md border-2 border-violet-600 bg-gray-900/70 backdrop-blur-lg  w-full max-h-60 overflow-auto 
                    ${open ? 'z-20' : 'z-0'}`}
				>
					{#each items as item (item.value)}
						<ListboxOption
							value={asAny(item.value)}
							on:click={() => dispatch('change', item.value)}
							class={({ active }) =>
								`text-white hover:bg-violet-500 w-full py-2 px-4 cursor-pointer
                            	${active ? 'bg-violet-500' : ''} `}
						>
							{item.label}
						</ListboxOption>
					{/each}
				</ListboxOptions>
			</div>
		{/if}
	</Listbox>
</div>
