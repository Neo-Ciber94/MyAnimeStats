<script lang="ts">
	import Color from 'color'; // Import the color package
	import { twMerge } from 'tailwind-merge';

	// Props
	export let color: string;

	// Function to calculate a 20% darker color
	const darkerColor = Color(color).darken(0.2).hex();

	// Generate the gradient style based on the given color and darker color
	const gradientStyle = `background-image: linear-gradient(to right, ${color}, ${darkerColor})`;
</script>

<div class="flex flex-row gap-4 items-center">
	<div
		class={twMerge(
			`w-5 h-5 md:w-10 md:h-10 flex flex-row justify-center items-center 
		rounded-full p-4 text-[12px] md:text-[14px] font-semibold md:font-bold shadow-lg`,
			$$restProps.class
		)}
		style={gradientStyle}
	>
		<slot name="count" />
	</div>
	<span class="text-white text-lg">
		<slot name="text" />
	</span>
</div>
