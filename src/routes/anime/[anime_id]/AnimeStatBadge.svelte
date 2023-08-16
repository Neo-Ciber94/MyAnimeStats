<script>
	import { twMerge } from 'tailwind-merge';
</script>

<div class="flex flex-row p-4 text-white items-center gap-4">
	<div
		class={twMerge(
			`text-sm sm:text-lg md:text-2xl font-bold h-full px-2 py-2 md:px-4 md:py-3 rounded-lg
        min-w-[60px] sm:min-w-[80px] md:min-w-[100px] text-center
        font-mono`,
			$$restProps.class
		)}
	>
		<slot name="left" />
	</div>
	<div class="flex flex-col gap-1">
		<slot name="right" />
	</div>
</div>
