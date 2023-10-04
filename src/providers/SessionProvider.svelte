

<script lang="ts">
	import session from '../stores/session';
	import type { Session } from '@animelist/auth-sveltekit/client';

	export let userSession: Session | undefined | null = undefined;

	// Initialize the session
	session.initialize(userSession).catch(console.error);
</script>

<slot session={userSession} />
