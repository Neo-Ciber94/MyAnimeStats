<script lang="ts">
	import AnimatedNumber from '$components/AnimatedNumber.svelte';
	import SeasonAndYearIndicator from '$components/SeasonAndYearIndicator.svelte';
	import dayjs from 'dayjs';
	import type { PageServerData } from './$types';
	import AnimeStatBadge from './AnimeStatBadge.svelte';
	import AnimeStatusBadge from './AnimeStatusBadge.svelte';
	import LocalizedFormat from 'dayjs/plugin/localizedFormat';
	import AnimeMediaTypeBadge from './AnimeMediaTypeBadge.svelte';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import AnimeCarousel from '$components/AnimeCarousel.svelte';
	import AnimeInfoRow from './AnimeInfoRow.svelte';
	import { EyeSlashSolid, EyeSolid, StarSolid } from 'flowbite-svelte-icons';
	import MyAnimeListInput from './MyAnimeListInput.svelte';
	import session from '$stores/session';
	dayjs.extend(LocalizedFormat);

	export let data: PageServerData;

	const isNsfw = data.nsfw === 'black' || data.nsfw === 'gray';
	const shouldCensor = data.nsfw === 'black';
	let showUncensored = false;
	let openMyAnimeList = data.my_list_status != null;

	function getDurationFormatted(durationSeconds: number) {
		const durationMinutes = Math.ceil(durationSeconds / 60);
		return `${durationMinutes} min`;
	}

	function toggleCensor() {
		showUncensored = !showUncensored;
	}

	function addToFavorites() {
		openMyAnimeList = true;
	}
</script>

<div class="px-4 sm:px-20 pt-10 lg:container mx-auto mb-10">
	<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

	<section>
		<div class="flex flex-col">
			<div class="w-full justify-end my-2 sm:my-0 flex flex-row h-7 flex-wrap gap-2 items-center">
				{#if isNsfw}
					<div
						class="rounded-lg text-white capitalize flex flex-row items-center justify-center h-full text-xs px-4
						bg-gradient-to-b from-pink-500 to-pink-600"
					>
						nsfw
					</div>
				{/if}

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
		<div class="w-full md:w-1/3 overflow-hidden">
			<img
				src={data.main_picture.large}
				alt={data.title}
				class={`w-full mx-auto md:w-auto h-[300px] md:h-[400px] object-contain transition duration-200 ${
					shouldCensor && !showUncensored ? 'blur-lg' : 'blur-0'
				}`}
			/>

			{#if shouldCensor}
				<button
					on:click={toggleCensor}
					class="w-full flex flex-row items-center gap-2 justify-center p-1 mt-4
				text-xs text-pink-500 opacity-50 hover:opacity-100"
				>
					{#if showUncensored}
						<span class="font-semibold">Hide</span>
						<EyeSolid size="sm" class="!outline-none" />
					{:else}
						<span class="font-semibold">Show</span>
						<EyeSlashSolid size="sm" class="!outline-none" />
					{/if}
				</button>
			{/if}
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
							<span class="text-xs">{`${data.num_scoring_users.toLocaleString()} users`}</span>
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

	{#if $session.user}
		<section>
			{#if openMyAnimeList}
				<div class="bg-black/40 mt-8 mb-4 px-8 pb-8 pt-2 rounded-lg">
					<h1 class="text-white mb-12 mt-4 text-3xl">My List Status</h1>
					<MyAnimeListInput
						animeId={data.id}
						episodesSeen={data.my_list_status?.num_episodes_watched}
						numEpisodes={data.num_episodes}
						myScore={data.my_list_status?.score}
						status={data.my_list_status?.status}
					/>
				</div>
			{:else}
				<div class="bg-black/40 mt-8 mb-4 px-8 pb-8 pt-2 rounded-lg">
					<h1 class="text-white mb-12 mt-4 text-3xl">My List Status</h1>
					<div class="w-full justify-center">
						<Button on:click={addToFavorites} class="flex flex-row gap-2 w-full">
							<StarSolid />
							<span>Add to favorites</span>
						</Button>
					</div>
				</div>
			{/if}
		</section>
	{/if}

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
						<AnimeInfoRow title="English">
							<span slot="content">{data.alternative_titles.en}</span>
						</AnimeInfoRow>
					{/if}

					{#if data.alternative_titles.ja}
						<AnimeInfoRow title="Japanese">
							<span slot="content">{data.alternative_titles.ja}</span>
						</AnimeInfoRow>
					{/if}

					{#if data.alternative_titles.synonyms && data.alternative_titles.synonyms.length > 0}
						<AnimeInfoRow title="Synonyms">
							<svelte:fragment slot="content">
								{#if data.alternative_titles.synonyms}
									{#each data.alternative_titles.synonyms as synonym}
										<span>{synonym}</span>
									{/each}
								{/if}
							</svelte:fragment>
						</AnimeInfoRow>
					{/if}
				{/if}

				<h3 class="text-white text-xl mt-8 mb-1 font-bold">Information</h3>
				<AnimeInfoRow title="Type">
					<svelte:fragment slot="content">
						{AnimeHelper.mediaTypeToString(data.media_type)}
					</svelte:fragment>
				</AnimeInfoRow>

				<AnimeInfoRow title="Episodes">
					<span slot="content">{data.num_episodes || 'Unknown'}</span>
				</AnimeInfoRow>

				<AnimeInfoRow title="Status">
					<span slot="content"> {AnimeHelper.airingStatusToString(data.status)}</span>
				</AnimeInfoRow>

				{#if data.average_episode_duration}
					<AnimeInfoRow title="Episode Duration">
						<span slot="content">{getDurationFormatted(data.average_episode_duration)}</span>
					</AnimeInfoRow>
				{/if}

				{#if data.source}
					<AnimeInfoRow title="Source">
						<span slot="content">{AnimeHelper.sourceTypeToString(data.source)}</span>
					</AnimeInfoRow>
				{/if}

				{#if data.studios && data.studios.length > 0}
					<AnimeInfoRow title="Studios">
						<svelte:fragment slot="content">
							{#each data.studios as studio}
								<span>{studio.name}</span>
							{/each}
						</svelte:fragment>
					</AnimeInfoRow>
				{/if}

				{#if data.rating}
					<AnimeInfoRow title="Rating">
						<span slot="content">{AnimeHelper.ratingToString(data.rating)}</span>
					</AnimeInfoRow>
				{/if}

				{#if data.nsfw}
					<AnimeInfoRow title="NSFW">
						<svelte:fragment slot="content">
							{#if data.nsfw === 'black'}
								<span class="text-pink-600">This work is not safe for work</span>
							{:else if data.nsfw === 'gray'}
								<span class="text-pink-300">This work may be not safe for work</span>
							{:else if data.nsfw === 'white'}
								<span class="text-yellow-50">This work is safe for work</span>
							{/if}
						</svelte:fragment>
					</AnimeInfoRow>
				{/if}

				{#if data.related_anime && data.related_anime.length > 0}
					<div>
						<h3 class="text-white text-xl mt-8 mb-3 font-bold">Related Anime</h3>
						<div class="bg-black/20 p-2 rounded-lg">
							<AnimeCarousel
								animeList={data.related_anime}
								autoPlay={data.related_anime.length >= 10}
								mapTitle={(anime) => {
									return `${anime.node.title} (${anime.relation_type_formatted})`;
								}}
							/>
						</div>
					</div>
				{/if}

				{#if data.recommendations && data.recommendations.length > 0}
					<div>
						<h3 class="text-white text-xl mt-8 mb-3 font-bold">Recommendations</h3>
						<div class="bg-black/20 p-2 rounded-lg">
							<AnimeCarousel
								animeList={data.recommendations}
								autoPlay={data.recommendations.length >= 10}
							/>
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
