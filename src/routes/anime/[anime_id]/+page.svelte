<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="px-20 pt-10 container mx-auto mb-10">
	<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

	<section>
		<h1 class="text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[2.5em]">
			{data.title}
		</h1>
	</section>

	<section class="flex flex-col items-center md:items-start md:flex-row justify-around gap-4">
		<div class="w-full md:w-1/3">
			<img
				src={data.main_picture.large}
				alt={data.title}
				class="w-full mx-auto md:w-auto h-[200px] md:h-[400px] object-cover md:object-contain"
			/>
		</div>

		<div class="w-full md:w-2/3">
			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">General</h3>
				<div class="p-4 bg-gray-950 rounded-lg">
					<div
						class="bg-violet-500 w-12 h-12 rounded-full flex flex-row justify-center items-center text-white"
					>
						{data.mean}
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
