<script lang="ts">
	import elementEmphasis from '$stores/elementEmphasis';
	import { onMount } from 'svelte';

	onMount(() => {
		elementEmphasis.initialize();
	});
</script>
