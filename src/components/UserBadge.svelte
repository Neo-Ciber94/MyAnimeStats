<script lang="ts">
	import type { AnimeBadge } from '@/lib/badges/AnimeBadge';
	import { Tooltip } from 'flowbite-svelte';
	import DOMPurify from 'dompurify';

	export let badge: AnimeBadge;
	export let size = 25;

	function getStyles() {
		const styles: string[] = [];

		styles.push(`color: ${badge.styles?.color ?? 'white'};`);
		styles.push(`background: ${badge.styles?.background ?? 'black'};`);

		if (badge.styles?.border) {
			styles.push(`border: ${badge.styles.border};`);
		}

		return styles.join('');
	}
</script>

<div
	id={badge.id}
	style={getStyles()}
	class="px-4 py-2 shadow-sm rounded-lg text-xs min-w-[80px] gap-2
        cursor-pointer flex flex-row items-center justify-center flex-nowrap"
>
	{#if badge.icon}
		{@html DOMPurify.sanitize(badge.icon(size))}
	{/if}

	{badge.name}
</div>
<Tooltip class="bg-black text-white text-xs p-3" triggeredBy={`#${badge.id}`}>
	{badge.description}
</Tooltip>
