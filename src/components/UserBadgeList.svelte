<script lang="ts">
	import type { User } from '@/lib/myanimelist/common/user';
	import UserBadge from './UserBadge.svelte';
	import type { AnimeBadge } from '@/lib/badges/AnimeBadge';

	export let badges: AnimeBadge[];
	export let user: User;
</script>

<div class="flex flex-row flex-wrap gap-2">
	{#each badges as badge}
		<UserBadge {badge} {user}/>
	{/each}
</div>
