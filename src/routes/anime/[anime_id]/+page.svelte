<script lang="ts">
	import AnimatedNumber from '$components/AnimatedNumber.svelte';
	import SeasonAndYearIndicator from '$components/SeasonAndYearIndicator.svelte';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import AnimeStatBadge from './AnimeStatBadge.svelte';
	import AnimeStatusBadge from './AnimeStatusBadge.svelte';
	import LocalizedFormat from 'dayjs/plugin/localizedFormat';
	dayjs.extend(LocalizedFormat);

	export let data: PageServerData;
</script>

<div class="px-4 sm:px-20 pt-10 lg:container mx-auto mb-10">
	<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

	<section>
		<div class="flex flex-col">
			<div class="w-full justify-end my-2 sm:my-0 flex flex-row flex-wrap gap-2">
				{#if data.status}
					<AnimeStatusBadge status={data.status} />
				{/if}

				{#if data.start_season}
					<SeasonAndYearIndicator season={data.start_season.season} year={data.start_season.year} />
				{/if}
			</div>

			<div class="items-center justify-between border-b-4 border-b-orange-500 mb-4">
				<h1
					class="text-xl mb-2 sm:mb-0 md:text-3xl !leading-[1.3em] sm:!leading-[2em] text-white text-center lg:text-left"
				>
					{data.title}
				</h1>
			</div>
		</div>
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
					<AnimeStatBadge class="bg-gradient-to-br from-pink-500 to-pink-600">
						<svelte:fragment slot="left">
							{#if data.mean != null && data.mean > 0}
								<AnimatedNumber value={data.mean} decimalPlaces={2} />
							{:else}
								N/A
							{/if}
						</svelte:fragment>

						<svelte:fragment slot="right">
							<span class="text-sm md:text-2xl">Score</span>
							<span class="text-xs">{`${data.num_scoring_users} users`}</span>
						</svelte:fragment>
					</AnimeStatBadge>

					<AnimeStatBadge class="bg-gradient-to-br from-orange-500 to-orange-600">
						<svelte:fragment slot="left">
							{#if data.rank != null && data.rank > 0}
								#<AnimatedNumber value={data.rank} />
							{:else}
								N/A
							{/if}
						</svelte:fragment>
						<svelte:fragment slot="right">
							<span class="text-sm md:text-2xl">Rank</span>
						</svelte:fragment>
					</AnimeStatBadge>

					<AnimeStatBadge class="bg-gradient-to-br from-violet-500 to-violet-600">
						<svelte:fragment slot="left">
							{#if data.popularity}
								#<AnimatedNumber value={data.popularity} />
							{:else}
								N/A
							{/if}
						</svelte:fragment>

						<svelte:fragment slot="right">
							<span class="text-sm md:text-2xl">Popularity</span>
						</svelte:fragment>
					</AnimeStatBadge>
				</div>
			</div>

			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">Synopsis</h3>
				<p class="text-white text-sm">
					{`${data.synopsis || 'N/A'}`}
				</p>
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

			<div class="pb-5">
				<h3 class="text-orange-500 text-2xl mb-2">Calendar</h3>
				<div class="text-white text-sm">
					{#if data.status == 'not_yet_aired'}
						<span>{`Release date `}</span>
						<span class="text-orange-500">
							{#if data.start_date}
								{dayjs(data.start_date).format('LL')}
							{:else}
								Unknown
							{/if}
						</span>
					{:else if data.status == 'currently_airing'}
						<span>{`Airing since `}</span>
						<span class="text-orange-500">{dayjs(data.start_date).format('LL')}</span>
					{:else}
						{#if data.start_date}
							<span>{`Aired from `}</span>
							<span class="text-orange-500">{dayjs(data.start_date).format('LL')}</span>
						{/if}

						{#if data.end_date}
							<span>{` to `}</span>
							<span class="text-orange-500">{dayjs(data.end_date).format('LL')}</span>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</section>
</div>
