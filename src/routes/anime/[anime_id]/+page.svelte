<script lang="ts">
	import AnimatedNumber from '$components/AnimatedNumber.svelte';
	import SeasonAndYearIndicator from '$components/SeasonAndYearIndicator.svelte';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import AnimeStatBadge from './AnimeStatBadge.svelte';
	import AnimeStatusBadge from './AnimeStatusBadge.svelte';
	import LocalizedFormat from 'dayjs/plugin/localizedFormat';
	import AnimeMediaTypeBadge from './AnimeMediaTypeBadge.svelte';
	import { Accordion, AccordionItem, TabItem, Tabs } from 'flowbite-svelte';
	dayjs.extend(LocalizedFormat);

	export let data: PageServerData;
</script>

<div class="px-4 sm:px-20 pt-10 lg:container mx-auto mb-10">
	<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

	<section>
		<div class="flex flex-col">
			<div class="w-full justify-end my-2 sm:my-0 flex flex-row flex-wrap gap-2 items-center">
				{#if data.status}
					<AnimeStatusBadge status={data.status} />
				{/if}

				{#if data.media_type}
					<AnimeMediaTypeBadge mediaType={data.media_type} />
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
				<h3 class="text-orange-500 text-2xl mb-2">Stats</h3>
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
					{:else if data.start_date == data.end_date}
						<span>{`Aired on `}</span>
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

	<section class="flex flex-col">
		<Tabs
			divider={false}
			contentClass="bg-transparent py-4"
			activeClasses="p-4 text-white bg-violet-500 rounded-t-lg"
			inactiveClasses="p-4 text-violet-300 rounded-t-lg hover:text-white hover:bg-violet-500"
			defaultClass="text-indigo-500 mt-5 flex flex-row w-full flex-wrap border-b-2 gap-2 border-b-violet-500"
		>
			<TabItem open title="General">
				{#if data.alternative_titles}
					<h3 class="text-white font-bold text-xl mb-1">Alternative Titles</h3>

					{#if data.alternative_titles.en}
						<div class="information-grid">
							<div class="text-orange-500 min-w-[100px]">English</div>
							<div class="flex flex-col spacing-y-4 text-white">
								<span>{data.alternative_titles.en}</span>
							</div>
						</div>
					{/if}

					{#if data.alternative_titles.ja}
						<div class="information-grid">
							<div class="text-orange-500 min-w-[100px]">Japanese</div>
							<div class="flex flex-col spacing-y-4 text-white">
								<span>{data.alternative_titles.ja}</span>
							</div>
						</div>
					{/if}

					{#if data.alternative_titles.synonyms && data.alternative_titles.synonyms.length > 0}
						<div class="information-grid">
							<div class="text-orange-500 min-w-[100px]">Synonyms</div>
							<div class="flex flex-col spacing-y-4 text-white">
								{#if data.alternative_titles.synonyms}
									{#each data.alternative_titles.synonyms as synonym}
										<span>{synonym}</span>
									{/each}
								{/if}
							</div>
						</div>
					{/if}
				{/if}

				<h3 class="text-white text-xl mt-8 mb-1 font-bold">Information</h3>
				<div class="information-grid">
					<div class="text-orange-500 min-w-[100px]">Type</div>
					<div class="flex flex-col spacing-y-4 text-white">
						<span>{data.media_type}</span>
					</div>
				</div>

				<div class="information-grid">
					<div class="text-orange-500 min-w-[100px]">Episodes</div>
					<div class="flex flex-col spacing-y-4 text-white">
						<span>{data.num_episodes || 'Unknown'}</span>
					</div>
				</div>

				<div class="information-grid">
					<div class="text-orange-500 min-w-[100px]">Status</div>
					<div class="flex flex-col spacing-y-4 text-white">
						<span>{data.status}</span>
					</div>
				</div>

				{#if data.average_episode_duration}
					<div class="information-grid">
						<div class="text-orange-500 min-w-[100px]">Duration</div>
						<div class="flex flex-col spacing-y-4 text-white">
							<span>{data.average_episode_duration}</span>
						</div>
					</div>
				{/if}

				{#if data.source}
					<div class="information-grid">
						<div class="text-orange-500 min-w-[100px]">Source</div>
						<div class="flex flex-col spacing-y-4 text-white">
							<span>{data.source}</span>
						</div>
					</div>
				{/if}

				{#if data.studios}
					<div class="information-grid">
						<div class="text-orange-500 min-w-[100px]">Studios</div>
						<div class="flex flex-col spacing-y-4 text-white">
							{#each data.studios as studio}
								<span>{studio.name}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if data.rating}
					<div class="information-grid">
						<div class="text-orange-500 min-w-[100px]">Rating</div>
						<div class="flex flex-col spacing-y-4 text-white">
							{data.rating}
						</div>
					</div>
				{/if}
			</TabItem>

			<TabItem title="Pictures">
				{#if data.pictures}
					<div class="flex flex-row flex-wrap gap-4">
						{#each data.pictures as picture}
							<img
								alt={data.title}
								src={picture.large}
								class="object-contain w-[300px] h-[500px]"
							/>
						{/each}
					</div>
				{:else}
					<div class="w-full text-center text-2xl tex-violet-500/50">No pictures found</div>
				{/if}
			</TabItem>
		</Tabs>
	</section>
</div>

<style>
	.information-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: auto 1fr;
		align-items: center;
	}
</style>
