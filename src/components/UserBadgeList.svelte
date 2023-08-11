<script lang="ts">
	import UserBadge from './UserBadge.svelte';
	import type { AnimeBadge } from '@/lib/badges/AnimeBadge';

	export let badges: AnimeBadge[];
</script>

<div class="flex flex-row flex-wrap gap-2">
	{#each badges as badge}
		<UserBadge {badge} />
	{/each}
</div>
