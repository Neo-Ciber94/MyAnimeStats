<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let value: number;
	export let startValue = 0;
	export let durationMs = 500;
	export let decimalPlaces: number = 0;
	export let animate = true;
	export let id: string | undefined = undefined;
	export let once = false;

	let canAnimate = true;
	let animatedValue = tweened(startValue, { duration: durationMs });
	$: completed = $animatedValue === value;

	function getId() {
		return `animated-value-${id}`;
	}

	onMount(() => {
		if (once && id == null) {
			throw new Error('When `AnimatedNumber.once` is true you must specify an id');
		}

		if (once) {
			const wasCompleted = sessionStorage.getItem(getId());

			if (wasCompleted && wasCompleted === 'true') {
				canAnimate = false;
			}
		}

		if (animate) {
			animatedValue.set(value);
		}
	});

	$: {
		if (id && completed && once && typeof window !== 'undefined') {
			sessionStorage.setItem(getId(), 'true');
		}
	}
</script>

{#if animate && canAnimate}
	{$animatedValue.toFixed(decimalPlaces)}
{:else}
	{value.toFixed(decimalPlaces)}
{/if}
