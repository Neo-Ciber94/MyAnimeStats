<script lang="ts">
	import Color from 'color';

	export let text: string;
	export let color: string;
	export let amount = 0.1;
</script>

{#each text.split('') as char, index}
	<span
		style="color: {Color(color)
			.lighten(index * amount)
			.hex()};"
	>
		{char}
	</span>
{/each}
