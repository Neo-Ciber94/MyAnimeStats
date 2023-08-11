<script lang="ts">
	import badges from '@/lib/badges';
	import type { AnimeNodeWithStatus } from '@/lib/myanimelist/common/types';
	import type { User } from '@/lib/myanimelist/common/user';
	import UserBadge from './UserBadge.svelte';

	export let animeList: AnimeNodeWithStatus[];
	export let user: User;

	$: userBadges = badges.filter((badge) => badge.canHaveBadge(user, animeList));
</script>

<div class="flex flex-row flex-wrap gap-2">
	{#each userBadges as badge}
		<UserBadge {badge} />
	{/each}
</div>
