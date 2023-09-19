<script lang="ts">
	import type { User } from '@/lib/myanimelist/common/user';
	import UserBadge from './UserBadge.svelte';
	import type { AnimeBadge } from '@/lib/badges/AnimeBadge';
	import EmojiSad from './svgs/EmojiSad.svelte';
	import { blur } from 'svelte/transition';
	import { MinimizeSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let badges: AnimeBadge[];
	export let user: User;

	let open = true;
	let mounted = false;

	onMount(() => {
		mounted = true;
		return () => {
			mounted = false;
		};
	});
</script>

{#if mounted}
	{#if badges.length > 0}
		<div class="w-full flex flex-row justify-end pr-10 mb-2">
			<button on:click={() => (open = !open)} class="text-violet-500">
				{#if open}
					<MinimizeSolid class="w-6 h-6 outline-none" title="close" />
				{:else}
					<svg
						class="w-6 h-6"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 18 18"
					>
						<path
							d="M18 .989a1.016 1.016 0 0 0-.056-.277c-.011-.034-.009-.073-.023-.1a.786.786 0 0 0-.066-.1.979.979 0 0 0-.156-.224l-.007-.01a.873.873 0 0 0-.116-.073.985.985 0 0 0-.2-.128.959.959 0 0 0-.231-.047A.925.925 0 0 0 17 0h-4a1 1 0 1 0 0 2h1.664l-3.388 3.552a1 1 0 0 0 1.448 1.381L16 3.5V5a1 1 0 0 0 2 0V.989ZM17 12a1 1 0 0 0-1 1v1.586l-3.293-3.293a1 1 0 0 0-1.414 1.414L14.586 16H13a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM3.414 2H5a1 1 0 0 0 0-2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3.414l3.536 3.535A1 1 0 0 0 6.95 5.535L3.414 2Zm2.139 9.276L2 14.665V13a1 1 0 1 0-2 0v4c.006.046.015.09.027.135.006.08.022.16.048.235a.954.954 0 0 0 .128.2.95.95 0 0 0 .073.117l.01.007A.983.983 0 0 0 1 18h4a1 1 0 0 0 0-2H3.5l3.436-3.276a1 1 0 0 0-1.38-1.448h-.003Z"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if open}
			<div class="flex flex-row flex-wrap justify-center gap-2 overflow-hidden" out:blur in:blur>
				{#each badges as badge}
					<UserBadge {badge} {user} />
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex flex-row justify-center items-center p-4 text-2xl text-violet-400/60 gap-3">
			<span>You had no badges, watch more anime</span>
			<EmojiSad size={40} />
		</div>
	{/if}
{/if}
