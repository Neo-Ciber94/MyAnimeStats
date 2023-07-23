<script lang="ts">
	import { onMount } from 'svelte';
	import sessionStore from '../stores/sessionStore';

	onMount(() => {
		sessionStore.initialize();
	});
</script>

<slot session={sessionStore.session} />
