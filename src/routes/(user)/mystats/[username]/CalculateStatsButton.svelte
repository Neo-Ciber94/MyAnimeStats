<script lang="ts">
	import elementEmphasis, { ELEMENT_EMPHASIS_IDS } from '$stores/elementEmphasis';
	import { Button } from 'flowbite-svelte';
	import { ChartSolid } from 'flowbite-svelte-icons';
</script>

<form
	method="POST"
	action="?/calculate"
	on:submit={() => {
		elementEmphasis.setEmphasis(ELEMENT_EMPHASIS_IDS.myListLink);
	}}
>
	<Button type="submit" size="lg" color="purple" class="text-xl flex flex-row items-center gap-3">
		<ChartSolid class="w-5 h-5 text-white" />
		<slot />
	</Button>
</form>
