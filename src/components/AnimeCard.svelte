<script lang="ts" generics="TAnime extends AnimeObject">
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import type { AnimeObject } from '$lib/myanimelist/common/types';
	import { Badge } from 'flowbite-svelte';
	import AiringStatusBadge from './AiringStatusBadge.svelte';
	import { PLACEHOLDER_IMAGE } from '@/common/constants';

	export let anime: TAnime;

	function handleImgError(event: Event & { currentTarget: EventTarget & Element }) {
		const el = event.currentTarget as HTMLImageElement;
		el.src = PLACEHOLDER_IMAGE;
	}
</script>

<a
	href={`/anime/${anime.node.id}`}
	class="shadow-sm rounded-lg border border-violet-950 flex flex-col
	transition-all duration-300 hover:shadow-violet-900 hover:shadow-md
    bg-gray-950 gap-2 px-2 pt-4 pb-2 h-full items-center"
>
	<div class="text-right w-full flex flex-row gap-2 justify-end">
		<slot name="header">
			<AiringStatusBadge status={anime.node.status} class="text-[10px]" />
			{#if anime.node.mean}
				<Badge rounded color="purple" class="font-bold text-[10px]" title="User score">
					{anime.node.mean.toFixed(2)}
				</Badge>
			{/if}
		</slot>
	</div>

	<div class="overflow-hidden w-full">
		<img
			height={0}
			width={0}
			class="will-change-transform object-contain h-[200px] w-full sm:h-[280px] scale-100 hover:scale-110 transition duration-500 origin-center"
			src={AnimeHelper.getImage(anime)}
			alt={anime.node.title}
			on:error={handleImgError}
			data-anime-image
			style={`--anime-id: anime-${anime.node.id};`}
		/>
	</div>

	<h5 class="mb-2 text-xs text-center font-medium tracking-tight text-white break-all">
		{anime.node.title}
	</h5>

	{#if anime.node.genres}
		<div class="flex flex-row flex-wrap gap-1 justify-center mb-2">
			{#each anime.node.genres as genre}
				<div class="px-1 py-[2px] rounded-lg text-white bg-pink-600 text-[10px]">
					{genre.name}
				</div>
			{/each}
		</div>
	{/if}

	<div class="mt-auto w-full">
		<slot name="footer" />
	</div>
</a>
