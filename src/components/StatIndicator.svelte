<script lang="ts">
	import Color from 'color'; // Import the color package

	// Props
	export let color: string;

	// Function to calculate a 20% darker color
	const darkerColor = Color(color).darken(0.2).hex();

	// Generate the gradient style based on the given color and darker color
	const gradientStyle = `background-image: linear-gradient(to right, ${color}, ${darkerColor})`;
</script>

<div class="flex flex-row gap-4 items-center">
	<div
		class="w-10 h-10 flex flex-row justify-center items-center rounded-full p-4 text-[14px] font-bold shadow-lg"
		style={gradientStyle}
	>
		<slot name="count" />
	</div>
	<span class="text-white text-lg">
		<slot name="text" />
	</span>
</div>
