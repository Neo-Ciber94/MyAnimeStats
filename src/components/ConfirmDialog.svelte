<script lang="ts">
	import { useMediaQuery } from '@/hooks/useMediaQuery';
	import { Button } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let open = true;
	export let closeOnCancel = true;
	export let closeOnConfirm = true;

	let dialogElement: HTMLDialogElement;

	const isSmallScreen = useMediaQuery('(max-width: 640px)');

	const dispatch = createEventDispatcher<{
		cancel: { close: () => void };
		confirm: { close: () => void };
	}>();

	const handleClose = () => {
		open = false;
	};

	function handleConfirm(event: MouseEvent) {
		event.stopPropagation();
		dispatch('confirm', { close: handleClose });

		if (closeOnConfirm) {
			handleClose();
		}
	}

	function handleCancel(event: MouseEvent) {
		event.stopPropagation();
		dispatch('cancel', { close: handleClose });

		if (closeOnCancel) {
			handleClose();
		}
	}

	onMount(() => {
		const handleClick = (event: MouseEvent) => {
			const element = event.target as HTMLElement;
			if (open && element && !element.contains(dialogElement)) {
				handleCancel(event);
			}
		};

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	});

	$: {
		if (typeof window !== 'undefined') {
			if (open) {
				const scrollbarWidth = window.innerWidth - document.body.clientWidth;
				document.body.style.overflow = 'hidden';
				document.body.style.marginRight = $isSmallScreen ? '0rem' : `${scrollbarWidth}px`;
			} else {
				document.body.style.overflow = '';
				document.body.style.marginRight = '';
			}
		}
	}
</script>

{#if open}
	<div
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		class="w-full h-full bg-black/40 backdrop-blur-sm inset-0 fixed z-10"
	/>
{/if}

{#if open}
	<dialog
		{open}
		in:scale={{ duration: 400, start: 0.9, opacity: 0.5, easing: quintOut }}
		out:scale={{ duration: 400, start: 0.9, opacity: 0, easing: quintOut }}
		bind:this={dialogElement}
		class={twMerge(
			`p-2 fixed inset-0 bg-gray-900 rounded-lg border z-20 border-gray-300 text-white`,
			$$restProps.class
		)}
	>
		<slot />

		<div class="flex flex-row gap-2 justify-end">
			<Button color="purple" on:click={handleConfirm}>
				<slot name="confirm">Confirm</slot>
			</Button>

			<Button color="red" on:click={handleCancel}>
				<slot name="cancel">Cancel</slot>
			</Button>
		</div>
	</dialog>
{/if}
