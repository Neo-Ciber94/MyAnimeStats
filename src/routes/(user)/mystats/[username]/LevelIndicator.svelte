<script lang="ts">
	import type { AnimeObjectWithStatus } from '@/lib/myanimelist/common/types';
	import { MAX_LEVEL, calculateLevel } from '@/lib/utils/levels';
	import { Tooltip } from 'flowbite-svelte';
	import { CaretRightSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	export let animeList: AnimeObjectWithStatus[];

	const { level, episodesUntilNextLevel, episodesRequiredForNextLevel, episodesWatched } =
		calculateLevel(animeList);

	const initialPercentage = (episodesWatched / episodesRequiredForNextLevel) * 100;
	const percentage = spring(0, {
		damping: 0.5
	});
	
	onMount(() => {
		const timeout = window.setTimeout(() => {
			percentage.set(initialPercentage);
		}, 100);

		return () => {
			window.clearTimeout(timeout);
		};
	});

	$: levelBarWidth = Math.min(100, Math.max(0, $percentage));
</script>

<Tooltip
	trigger="click"
	arrow={false}
	triggeredBy="#level-indicator"
	class="bg-black border-2 border-orange-500"
>
	<ul class="space-y-2">
		<li class="flex flex-row items-center gap-1">
			<CaretRightSolid class="w-4 h-4 text-orange-600" />
			<p>
				<span class="text-orange-400">{episodesWatched}</span>
				{` `}
				<span>episodes watched </span>
			</p>
		</li>

		{#if level !== MAX_LEVEL}
			<li class="flex flex-row items-center gap-1">
				<CaretRightSolid class="w-4 h-4 text-orange-600" />
				<p>
					<span class="text-orange-400">{episodesUntilNextLevel}</span>
					{` episodes for level `}
					<span class="text-orange-400">{level + 1}</span>
				</p>
			</li>
		{/if}
	</ul>
</Tooltip>

<div
	id="level-indicator"
	class="relative rounded-full border-2 h-6 md:h-10 w-full min-w-[40px]
bg-gradient-to-r from-gray-200 to-gray-300 shadow-orange-500 glow cursor-pointer"
>
	<div class="level-box" style={`width: ${levelBarWidth}%`} />
	<span
		class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base md:text-xl
    font-mono font-bold text-orange-950 mix-blend-hard-light"
	>
		{`Level ${level}`}
	</span>
</div>

<style lang="postcss">
	.glow {
		box-shadow: 0 0 10px 0 var(--tw-shadow-color);
	}

	.level-box {
		@apply bg-gradient-to-r from-orange-400 via-amber-600 to-orange-600 h-full rounded-full;
		background-size: 300% 300%;
		animation: moveGradient 5s linear infinite;
	}

	@keyframes moveGradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
