<script lang="ts" generics="T">
	import type { AutocompleteItem } from './Autocomplete.svelte';
	import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher, onMount } from 'svelte';

	export let items: AutocompleteItem<T>[];
	export let selected: T[];
	export let placeholder: string | undefined = undefined;
	export let closeOnClickOutside = true;

	const dispatch = createEventDispatcher<{
		added: AutocompleteItem<T>;
		removed: AutocompleteItem<T>;
	}>();

	let search = '';
	let open = false;
	let searchInputRef: HTMLInputElement;
	let containerRef: HTMLDivElement;
	let listRef: HTMLUListElement;
	let elementRefs: HTMLElement[] = [];
	let hasFocus = false;

	$: currentItems = items
		.filter((item) => !selected.includes(item.value))
		.filter((item) =>
			item.label
				.toLowerCase()
				.replaceAll(/\s+/g, '')
				.includes(search.toLowerCase().replaceAll(/\s+/g, ''))
		);

	$: tags = selected.map((selectedValue) => {
		const item = items.find((x) => x.value === selectedValue);
		if (item == null) {
			throw new Error(`Value not found: ${JSON.stringify(selectedValue)}`);
		}

		return item.label;
	});

	onMount(() => {
		if (closeOnClickOutside === false) {
			return;
		}

		const handleClick = (e: MouseEvent) => {
			const target = e.target as Node;
			if (!containerRef.contains(target)) {
				open = false;
			}
		};

		window.addEventListener('click', handleClick);

		return () => {
			window.removeEventListener('click', handleClick);
		};
	});

	function addTag(newValue: T) {
		search = '';
		selected = [...selected, newValue];

		const item = items.find((x) => x.value === newValue);
		if (item) {
			dispatch('added', item);
		}
	}

	function removeTag(index: number) {
		const value = selected[index];
		selected = selected.filter((_, i) => i !== index);

		const item = items.find((x) => x.value === value);
		if (item) {
			dispatch('removed', item);
		}
	}

	function handleSelect(item: AutocompleteItem<T>) {
		addTag(item.value);
		open = false;
	}

	function handleOpen() {
		open = true;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<div class="relative w-full" bind:this={containerRef}>
	<div
		role="button"
		tabindex={-1}
		on:keydown={() => {
			hasFocus = true;
			open = true;
		}}
		on:blur={() => {
			hasFocus = false;
		}}
		class="w-full bg-white rounded-md flex-wrap flex flex-row items-center gap-1 px-1"
	>
		<slot name="icon" />

		{#each tags as tag, index}
			<button
				class="text-xs text-white bg-orange-500 hover:bg-orange-700 min-w-[40px] rounded-md
				shadow-sm p-2 flex flex-row items-center h-8"
			>
				<span>{tag}</span>
				<button class="ml-2 text-white hover:text-red-500" on:click={() => removeTag(index)}>
					<svg
						class="w-[10px] h-[10px]"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
				</button>
			</button>
		{/each}

		<input
			bind:value={search}
			bind:this={searchInputRef}
			on:click={handleOpen}
			on:focus={handleOpen}
			on:input={handleOpen}
			on:keydown={handleKeyDown}
			class={twMerge(
				$$props.class,
				`h-10 ${hasFocus ? 'w-auto' : 'w-0'} flex-grow outline-none bg-transparent`
			)}
			placeholder={tags.length === 0 ? placeholder : undefined}
		/>
	</div>

	<ul
		bind:this={listRef}
		class={`z-10 mt-2 border border-gray-300/50 overflow-x-hidden overflow-y-auto absolute w-full rounded-md max-h-52 ${
			open ? 'visible' : 'invisible'
		}`}
	>
		{#each currentItems as item, index}
			<li bind:this={elementRefs[index]}>
				<button on:click={() => handleSelect(item)} class="h-full w-full" tabIndex={0}>
					<slot name="option" {item} {index}>
						<div class={`py-2 pl-4 w-full h-full text-left bg-white hover:bg-violet-400`}>
							{item.label}
						</div>
					</slot>
				</button>
			</li>
		{/each}
	</ul>
</div>
