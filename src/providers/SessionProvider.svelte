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

	// Initialize the session
	session.initialize(userSession).catch(console.error);
</script>

<slot session={session.current} />
