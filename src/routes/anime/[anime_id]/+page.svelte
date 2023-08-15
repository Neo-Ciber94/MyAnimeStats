<script lang="ts">
	import AnimatedNumber from '$components/AnimatedNumber.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="px-4 sm:px-20 pt-10 lg:container mx-auto mb-10">
	<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

	<section>
		<h1
			class="text-xl md:text-3xl text-white mb-4 border-b-4 border-b-orange-500
			 !leading-[1.3em] sm:!leading-[2em] text-center lg:text-left"
		>
			{data.title}
		</h1>
	</section>

	<section class="flex flex-col items-center md:items-start md:flex-row justify-around gap-4">
		<div class="w-full md:w-1/3">
			<img
				src={data.main_picture.large}
				alt={data.title}
				class="w-full mx-auto md:w-auto h-[300px] md:h-[400px] object-contain"
			/>
		</div>

		<div class="w-full md:w-2/3">
			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">General</h3>
				<div
					class="p-4 bg-gray-950 rounded-lg flex flex-row items-center flex-wrap justify-between"
				>
					<div class="flex flex-row p-4 text-white items-center gap-4">
						<div
							class="text-lg md:text-2xl font-bold h-full px-2 py-2 md:px-4 md:py-3 rounded-lg
							min-w-[80px] md:min-w-[100px] text-center
							bg-gradient-to-br from-pink-500 to-pink-600 font-mono"
						>
							<AnimatedNumber value={data.mean} decimalPlaces={2} />
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm md:text-2xl">Score</span>
							<span class="text-xs">{`${data.num_scoring_users} users`}</span>
						</div>
					</div>

					<div class="flex flex-row p-4 text-white items-center gap-2">
						<div
							class="text-lg md:text-2xl font-bold h-full px-2 py-2 md:px-4 md:py-3 rounded-lg
							min-w-[80px] md:min-w-[100px] text-center
							bg-gradient-to-br from-orange-500 to-orange-600 font-mono"
						>
							{#if data.rank}
								#<AnimatedNumber value={data.rank} />
							{:else}
								N/A
							{/if}
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm md:text-2xl">Rank</span>
						</div>
					</div>

					<div class="flex flex-row p-4 text-white items-center gap-2">
						<div
							class="text-lg md:text-2xl font-bold h-full px-2 py-2 md:px-4 md:py-3 rounded-lg
							min-w-[80px] md:min-w-[100px] text-center
							bg-gradient-to-br from-violet-500 to-violet-600 font-mono"
						>
							{#if data.popularity}
								#<AnimatedNumber value={data.popularity} />
							{:else}
								N/A
							{/if}
						</div>
						<div class="flex flex-col gap-1">
							<span class="text-sm md:text-2xl">Popularity</span>
						</div>
					</div>
				</div>
			</div>

			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">Synopsis</h3>
				<p class="text-white text-sm">{data.synopsis}</p>
			</div>

			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">Genres</h3>
				<div class="flex flex-row flex-wrap gap-4">
					{#each data.genres as genre}
						<button
							class="text-white px-4 py-1 min-w-[50px] hover:bg-violet-800 rounded-lg text-xs bg-violet-600"
						>
							{genre.name}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>
