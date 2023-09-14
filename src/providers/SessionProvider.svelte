<script context="module" lang="ts">
	export type UserSession = {
		user: User;
		accessToken: string;
	};
</script>

<script lang="ts">
	import session from '../stores/session';
	import type { User } from '@/lib/myanimelist/common/user';

	export let userSession: UserSession | undefined | null = undefined;
	let wasInit = false;

	// Initialize the session
	session.initialize(userSession).catch(console.error);
	// if (!wasInit) {
	// 	session
	// 		.initialize(userSession)
	// 		.then(() => (wasInit = true))
	// 		.catch(console.error);
	// }
</script>

<slot session={session.current} />
