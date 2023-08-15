<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let value: number;
	export let startValue = 0;
	export let durationMs = 500;
	export let decimalPlaces: number = 0;

	let animatedValue = tweened(startValue, { duration: durationMs });

	onMount(() => {
		animatedValue.set(value);
	});
</script>

{$animatedValue.toFixed(decimalPlaces)}
