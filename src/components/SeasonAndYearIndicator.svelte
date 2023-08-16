<script lang="ts">
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import WinterIcon from '$assets/seasons/season-winter.svg';
	import SpringIcon from '$assets/seasons/season-spring.svg';
	import SummerIcon from '$assets/seasons/season-summer.svg';
	import FallIcon from '$assets/seasons/season-fall.svg';

	export let season: AnimeSeason;
	export let year: number;

	const SEASONS: Record<AnimeSeason, { icon: any; name: string }> = {
		winter: {
			icon: WinterIcon,
			name: 'Winter'
		},
		spring: {
			icon: SpringIcon,
			name: 'Spring'
		},
		summer: {
			icon: SummerIcon,
			name: 'Summer'
		},
		fall: {
			icon: FallIcon,
			name: 'Fall'
		}
	};
</script>

<div
	data-season={season}
	class="text-[13px] cursor-pointer justify-between pr-3 pl-2 flex flex-row gap-2 shadow-md items-center bg-white rounded-lg h-7 overflow-hidden"
>
	<div class="items-center h-full flex flex-row gap-1 py-1 text-center font-bold">
		<img class="mx-1" width="16" height="16" alt={SEASONS[season].name} src={SEASONS[season].icon} />
		<div>
			{SEASONS[season].name}
		</div>
	</div>

	<span class="mx-1">•</span>
	<div class="font-bold">{year}</div>
</div>

<style lang="postcss">
	[data-season='winter'] {
		@apply bg-cyan-200  text-blue-950;
	}

	[data-season='spring'] {
		@apply bg-lime-500 text-lime-950;
	}

	[data-season='summer'] {
		@apply bg-yellow-300 text-black;
	}

	[data-season='fall'] {
		@apply bg-orange-500 text-white px-2;
	}
</style>
