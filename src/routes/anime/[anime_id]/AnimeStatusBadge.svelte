<script lang="ts">
	import type { AiringStatus } from '@/lib/myanimelist/common/types';

	export let status: AiringStatus;

	const STATUSES: Record<
		AiringStatus,
		{
			name: string;
		}
	> = {
		currently_airing: {
			name: 'Airing'
		},
		finished_airing: {
			name: 'Finished'
		},
		not_yet_aired: {
			name: 'Not available'
		}
	};
</script>

<div class="px-4 flex flex-row items-center rounded-lg text-xs font-semibold" data-status={status}>
	{STATUSES[status].name}
</div>

<style lang="postcss">
	[data-status='currently_airing'] {
		@apply bg-lime-500 text-white;
	}

	[data-status='finished_airing'] {
		@apply bg-red-500 text-white;
	}

	[data-status='not_yet_aired'] {
		@apply bg-black text-white;
	}
</style>
