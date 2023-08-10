<script lang="ts">
	import type { AnimeNodeWithStatus } from '$lib/myanimelist/common/types';
	import Enumerable from 'linq';

	export let animeList: AnimeNodeWithStatus[];

    const averageScore = Enumerable.from(animeList).average(x => x.node.mean)
</script>

<section>
	<div class="flex flex-row justify-center">
		<h1 class="leading-[1.6em] text-white font-bold text-lg border-b-2 border-b-violet-500">
			My Scores
		</h1>
	</div>

    <div>

    </div>
</section>
