<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let isOpen: boolean;
	export let dialogClass: string | undefined = undefined;
	export let backdropClass: string | undefined = undefined;

	const dispatch = createEventDispatcher<{ close: void }>();

	let mounted = false;
	onMount(() => (mounted = true));

	$: cleanupScrollLock = (() => {
		if (cleanupScrollLock) {
			cleanupScrollLock();
		}
		if (!isOpen) return;
		if (!mounted) return;

		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const overflow = document.body.style.overflow;
		const paddingRight = document.body.style.paddingRight;

		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = `${scrollbarWidth}px`;
		document.body.style.width = '100%';

		return () => {
			document.body.style.overflow = overflow;
			document.body.style.paddingRight = paddingRight;
			document.body.style.width = '';
		};
	})();

	onDestroy(() => {
		if (cleanupScrollLock) {
			cleanupScrollLock();
		}
	});

	onMount(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				isOpen = false;
				if (cleanupScrollLock) {
					cleanupScrollLock();
				}
			}
		}

		window.addEventListener('keydown', handleEscape);
		return () => {
			window.removeEventListener('keydown', handleEscape);
		};
	});

	function closeDialog() {
		dispatch('close');
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="relative w-full">
		<slot {closeDialog} name="backdrop">
			<div
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
				on:click={closeDialog}
				class={twMerge(
					'w-full h-full bg-black/40 backdrop-blur-sm inset-0 fixed z-10',
					backdropClass
				)}
			/>
		</slot>

		<div
			in:scale={{ duration: 400, start: 0.9, opacity: 0.5, easing: quintOut }}
			out:scale={{ duration: 400, start: 0.9, opacity: 0, easing: quintOut }}
			class="fixed w-screen left-0 flex flex-row justify-center bottom-1/2 z-40"
		>
			<div class={dialogClass}>
				<slot />
			</div>
		</div>
	</div>
{/if}
