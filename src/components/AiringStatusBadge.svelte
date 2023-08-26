<script lang="ts">
	import type { AiringStatus } from '$lib/myanimelist/common/types';
	import { Badge } from 'flowbite-svelte';

	export let status: AiringStatus;
</script>

{#if status === 'currently_airing'}
	<Badge rounded color="green" class={$$restProps.class}>Airing</Badge>
{:else if status === 'finished_airing'}
	<Badge rounded color="yellow" class={$$restProps.class}>Finished</Badge>
{:else if status === 'not_yet_aired'}
	<Badge rounded color="red" class={$$restProps.class}>Not Airing</Badge>
{:else}
	<Badge rounded class={$$restProps.class}>{status}</Badge>
{/if}
