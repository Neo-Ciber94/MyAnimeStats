<script lang="ts">
	import type { AnimeObject } from '$lib/myanimelist/common/types';
	import { Badge } from 'flowbite-svelte';
	import AiringStatusBadge from './AiringStatusBadge.svelte';

	export let anime: AnimeObject;
</script>

<a
	href={`/anime/${anime.node.id}`}
	class="shadow-lg rounded-lg border border-violet-950 flex flex-col
    bg-gray-950 gap-4 px-2 pt-4 pb-2 h-full items-center"
>
	<div class="text-right w-full flex flex-row gap-2 justify-end">
		<AiringStatusBadge status={anime.node.status} />
		{#if anime.node.mean}
			<Badge rounded color="purple" class="font-bold">{anime.node.mean.toFixed(2)}</Badge>
		{/if}
	</div>

	<div class="overflow-hidden w-full">
		<img
			height={0}
			width={0}
			class="object-contain w-full h-[280px] scale-100 hover:scale-110 transition duration-500 origin-center"
			src={anime.node.main_picture.large}
			alt={anime.node.title}
			style={'will-change: transform;'}
		/>
	</div>

	<h5 class="mb-2 text-xs text-center font-medium tracking-tight text-white break-all">
		{anime.node.title}
	</h5>
</a>
