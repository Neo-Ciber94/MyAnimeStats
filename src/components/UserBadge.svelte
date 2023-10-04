<script lang="ts">
	import type { AnimeBadge } from '@/lib/badges/AnimeBadge';
	import { Spinner, Tooltip } from 'flowbite-svelte';
	import type { User } from '@/lib/myanimelist/common/types';
	import DOMPurify from 'dompurify';

	export let badge: AnimeBadge;
	export let user: User;
	export let size = 20;

	function getStyles() {
		const styles: string[] = [];
		const py = 12;
		const px = 16 + (badge.styles?.px ?? 0);

		styles.push(`color: ${badge.styles?.color ?? 'white'}`);
		styles.push(`background: ${badge.styles?.background ?? 'black'}`);
		styles.push(`padding: ${py}px ${px}px`);

		if (badge.styles?.border) {
			styles.push(`border: ${badge.styles.border}`);
		}

		if (badge.styles?.borderImage) {
			styles.push(`border-image: ${badge.styles.borderImage}`);
		}

		if (badge.styles?.borderImageSlice) {
			styles.push(`border-image-slice: ${badge.styles.borderImageSlice}`);
		}

		return styles.join(';');
	}

	function getBadgeName() {
		return typeof badge.name === 'function' ? badge.name(user) : badge.name;
	}

	async function getIcon() {
		if (!badge.icon) {
			return null;
		}

		const result = badge.icon(size);
		return result instanceof Promise ? result : Promise.resolve(result);
	}

	// We are getting this error: ReferenceError: window is not defined
	function sanitizeHTML(rawHtml: string) {
		if (typeof window === 'undefined') {
			return null;
		}

		return DOMPurify.sanitize(rawHtml);
	}

	const badgeIcon = getIcon();
</script>

<div
	id={badge.id}
	style={getStyles()}
	class="shadow-sm rounded-lg text-xs min-w-[80px] gap-2 whitespace-nowrap
        cursor-pointer flex flex-row items-center justify-center flex-nowrap h-12 overflow-hidden"
>
	{#await badgeIcon}
		<Spinner bg="bg-transparent" size={'8'} />
	{:then icon}
		{#if icon}
			{@html sanitizeHTML(icon)}
		{/if}
	{/await}

	{@html sanitizeHTML(getBadgeName())}
</div>
<Tooltip
	class="bg-gray-950 border border-gray-200 text-white text-sm p-3"
	triggeredBy={`#${badge.id}`}
>
	{badge.description}
</Tooltip>
