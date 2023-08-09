<script context="module" lang="ts">
	export type AutocompleteItem<T> = {
		label: string;
		value: T;
	};
</script>

<script lang="ts" generics="T">
	import { twMerge } from 'tailwind-merge';

	import { CloseButton } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let items: AutocompleteItem<T>[];
	export let selected: T | undefined;
	export let placeholder: string | undefined = undefined;
	export let closeOnClickOutside = true;

	let search = '';
	let open = false;
	let searchInputRef: HTMLInputElement;
	let containerRef: HTMLDivElement;
	let listRef: HTMLUListElement;
	let elementRefs: HTMLElement[] = [];

	$: currentItems = items.filter((item) =>
		item.label
			.toLowerCase()
			.replaceAll(/\s+/g, '')
			.includes(search.toLowerCase().replaceAll(/\s+/g, ''))
	);

	$: activeIndex = currentItems.findIndex((item) => item?.value === selected);

	onMount(() => {
		setValue(selected);
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

	function setValue(newValue: unknown) {
		const itemIndex = currentItems.findIndex((x) => x.value === newValue);
		const item = currentItems[itemIndex];
		search = item?.label ?? '';
		selected = item?.value;
	}

	function handleSelect(item: AutocompleteItem<T>) {
		setValue(item.value);
		open = false;
	}

	function handleOpen() {
		open = true;
	}

	function handleClear() {
		search = '';
		selected = undefined;
		open = false;

		if (searchInputRef) {
			searchInputRef.focus();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}

		if (event.key === 'Enter') {
			const item = currentItems[activeIndex];
			if (item) {
				handleSelect(item);
			}
		}

		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			if (event.key === 'ArrowUp') {
				activeIndex -= 1;
			}

			if (event.key === 'ArrowDown') {
				activeIndex += 1;
			}

			if (activeIndex >= currentItems.length) {
				activeIndex = 0;
			} else if (activeIndex < 0) {
				activeIndex = currentItems.length - 1;
			}

			const ref = elementRefs[activeIndex];

			if (ref) {
				const offsetTop = ref.offsetTop;
				listRef.scrollTo({ top: offsetTop });
			}
		}
	}
</script>

<div class="relative w-full" bind:this={containerRef}>
	<div class="w-full h-full relative">
		<input
			bind:value={search}
			bind:this={searchInputRef}
			on:click={handleOpen}
			on:focus={handleOpen}
			on:input={handleOpen}
			on:keydown={handleKeyDown}
			class={$$props.class}
			{placeholder}
		/>
		<slot name="clear" clear={handleClear} canClear={search.length}>
			<CloseButton
				on:click={handleClear}
				class={`absolute right-0 -translate-y-1/2 top-1/2 
				hover:text-red-500 hover:bg-transparent focus:ring-transparent focus:bg-transparent
				${search.length > 0 ? 'visible' : 'invisible'}`}
			/>
		</slot>
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
					<slot name="option" {item} {index} active={activeIndex === index}>
						<div
							class={`py-2 pl-4 w-full h-full text-left ${
								activeIndex === index
									? 'bg-violet-500 text-white'
									: 'hover:bg-violet-200 bg-white text-black'
							}`}
						>
							{item.label}
						</div>
					</slot>
				</button>
			</li>
		{/each}
	</ul>
</div>
