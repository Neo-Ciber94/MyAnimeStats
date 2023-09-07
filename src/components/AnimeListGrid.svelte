<script lang="ts" generics="TAnime extends AnimeObject">
	import type { AnimeObject } from '@/lib/myanimelist/common/types';
	import AnimeCard from './AnimeCard.svelte';

	export let animeList: TAnime[];
</script>

<div
	class="items-center mb-4 gap-2 grid
        grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
        sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
>
	{#each animeList as anime, idx}
		{#key anime.node.id}
			<div class="fade-in h-full opacity-0 scale-50" style="--animation-delay: {(idx % 10) * 50}ms">
				<slot {anime} name="anime">
					<AnimeCard {anime} />
				</slot>
			</div>
		{/key}
	{/each}
</div>

<style>
	.fade-in {
		animation: fadeIn forwards 300ms ease-out;
		animation-delay: var(--animation-delay);
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
