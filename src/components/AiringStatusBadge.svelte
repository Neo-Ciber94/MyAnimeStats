<script lang="ts">
	import type { AiringStatus } from '$lib/myanimelist/common/types';
	import { Badge } from 'flowbite-svelte';

	export let status: AiringStatus;
</script>

{#if status === 'currently_airing'}
	<Badge rounded color="green">Airing</Badge>
{:else if status === 'finished_airing'}
	<Badge rounded color="yellow">Finished</Badge>
{:else if status === 'not_yet_aired'}
	<Badge rounded color="red">Not Airing</Badge>
{:else}
	<Badge rounded>{status}</Badge>
{/if}
