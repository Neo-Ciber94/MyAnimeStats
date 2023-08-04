<script lang="ts">
	import { onMount } from 'svelte';
	import session from '../stores/sessionStore';

	onMount(async () => {
		await session.initialize();
	});
</script>

<slot session={session.current} />
