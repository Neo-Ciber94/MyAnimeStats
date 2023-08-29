<script>
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ duration: 400, x: -10 }}>
	<slot />
</div>
