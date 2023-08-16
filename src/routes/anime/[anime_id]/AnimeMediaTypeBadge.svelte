<script lang="ts">
	import type { MediaType } from '@/lib/myanimelist/common/types';

	export let mediaType: MediaType;

	const MEDIA_TYPE: Record<MediaType, string> = {
		unknown: 'Unknown',
		movie: 'Movie',
		music: 'Music',
		tv: 'TV',
		ona: 'ONA',
		ova: 'OVA',
		special: 'Special'
	};
</script>

<div
	data-media={mediaType}
	class="h-7 min-w-[60px] px-4 rounded-lg overflow-hidden
    border-2 flex border-gray-500 flex-row items-center justify-center
    bg-gradient-to-t from-black to-gray-900 text-white text-xs"
>
	{MEDIA_TYPE[mediaType]}
</div>

<style lang="postcss">
	[data-media='tv'] {
		@apply border-violet-500;
	}

	[data-media='movie'] {
		@apply border-orange-500;
	}

	[data-media='music'] {
		@apply border-yellow-400;
	}

	[data-media='ona'],
	[data-media='ova'],
	[data-media='special'] {
		@apply border-lime-500;
	}
</style>
