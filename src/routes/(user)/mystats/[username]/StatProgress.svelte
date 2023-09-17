<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { twMerge } from 'tailwind-merge';

	export let max: number;
	export let value: number;
	export let delay = 500;
	export let containerClass: string | undefined = undefined;

	const animatedValue = spring(0);

	onMount(() => {
		setTimeout(() => {
			animatedValue.set(value);
		}, delay);
	});

	$: percent = $animatedValue / max;
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row gap-2 items-center">
		<div class="min-w-[40px]">
			<slot name="text">
				{(percent * 100).toFixed(2)}.%
			</slot>
		</div>

		<div class="w-[5px] h-[5px] rounded-lg bg-white mr-4" />

		<slot name="title" />
	</div>
	<div class={twMerge('w-full bg-gray-200 rounded-full overflow-hidden', containerClass)}>
		<div
			class={`${twMerge(
				'bg-blue-600 font-medium text-blue-100 items-center flex overflow-hidden flex-row justify-center p-0.5 leading-none rounded-full',
				$$restProps.class
			)}`}
			style="width: {percent * 100}%;"
		/>
	</div>
</div>
