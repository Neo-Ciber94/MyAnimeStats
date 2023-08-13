<script lang="ts">
	import { onMount } from 'svelte';
	import session from '../stores/session';

	onMount(async () => {
		await session.initialize();
	});
</script>

<slot session={session.current} />
