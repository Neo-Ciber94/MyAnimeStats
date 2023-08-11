<script lang="ts">
	import badges from '@/lib/badges';
	import type { AnimeNodeWithStatus } from '@/lib/myanimelist/common/types';
	import type { User } from '@/lib/myanimelist/common/user';
	import { Tooltip } from 'flowbite-svelte';

	export let animeList: AnimeNodeWithStatus[];
	export let user: User;
</script>

<div class="flex flex-row flex-wrap gap-2">
	{#each badges as badge, index}
		{#if badge.canHaveBadge(user, animeList)}
			<div
				id={`anime-badge-${index}`}
				class="px-4 py-2 shadow-sm rounded-lg text-xs min-w-[80px] cursor-pointer"
				style={`color: ${badge.fgColor}; background-color: ${badge.bgColor};`}
			>
				{badge.name}
			</div>
			<Tooltip class="bg-black text-white text-xs p-3" triggeredBy={`#anime-badge-${index}`}
				>{badge.description}</Tooltip
			>
		{/if}
	{/each}
</div>
