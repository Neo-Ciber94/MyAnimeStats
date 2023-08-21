<script context="module" lang="ts">
	export type UserSession = {
		user: User;
		accessToken: string;
	};
</script>

<script lang="ts">
	import session from '../stores/session';
	import type { User } from '@/lib/myanimelist/common/user';

	export let userSession: UserSession | undefined = undefined;
	let wasInit = false;

	// We don't use onMount because it does not run on the server
	if (!wasInit) {
		session
			.initialize(userSession)
			.then(() => (wasInit = true))
			.catch(console.error);
	}
</script>

<slot session={session.current} />
