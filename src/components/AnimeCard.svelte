<script lang="ts">
	import type { AnimeNode } from '$lib/myanimelist/common/types';

	export let anime: AnimeNode;
</script>

<div
	class="shadow-lg rounded-lg border border-violet-950 flex flex-col
    bg-gray-950 gap-4 p-4 w-full h-full items-center"
>
	<div class="overflow-hidden w-full">
		<img
			height={0}
			width={0}
			class="object-cover w-full h-[400px] scale-100 hover:scale-110 transition duration-500 origin-center"
			src={anime.node.main_picture.large}
			alt={anime.node.title}
            style={"will-change: transform;"}
		/>
	</div>

	<h5 class="mb-2 text-md text-center font-bold tracking-tight text-white break-all">
		{anime.node.title}
	</h5>
</div>
