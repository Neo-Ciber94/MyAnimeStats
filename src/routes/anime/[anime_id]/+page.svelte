<script lang="ts">
	import AnimatedNumber from '$components/AnimatedNumber.svelte';
	import SeasonAndYearIndicator from '@/routes/anime/[anime_id]/SeasonAndYearIndicator.svelte';
	import type { PageServerData } from './$types';
	import AnimeStatBadge from './AnimeStatBadge.svelte';
	import AnimeStatusBadge from './AnimeStatusBadge.svelte';
	import AnimeMediaTypeBadge from './AnimeMediaTypeBadge.svelte';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import AnimeCarousel from '$components/AnimeCarousel.svelte';
	import AnimeInfoRow from './AnimeInfoRow.svelte';
	import { EyeSlashSolid, EyeSolid, StarSolid } from 'flowbite-svelte-icons';
	import MyAnimeListInput from './MyAnimeListInput.svelte';
	import session from '$stores/session';
	import { fly, slide } from 'svelte/transition';
	import PageTransition from '$components/PageTransition.svelte';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import dayjs from 'dayjs';
	import { invalidateAll } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import SEO from '$components/SEO.svelte';
	import { browser } from '$app/environment';
	dayjs.extend(localizedFormat);

	export let data: PageServerData;
	let { anime } = data;

	onDestroy(() => {
		if (browser) {
			invalidateAll();
		}
	});

	const isNsfw = anime.nsfw === 'black' || anime.nsfw === 'gray';
	const shouldCensor = AnimeHelper.shouldCensor({ node: anime });
	let showUncensored = false;
	let openMyAnimeList = anime.my_list_status != null;
	let isInMyList = anime.my_list_status != null;

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

<SEO
	title={anime.title}
	description={anime.synopsis}
	image={anime.main_picture?.medium || anime.main_picture?.large}
/>

{#key anime.id}
	<PageTransition>
		<div class="px-4 sm:px-20 pt-10 lg:container mx-auto mb-10">
			<!-- <pre class="text-white">{JSON.stringify(data, null, 2)}</pre> -->

			<section>
				<div class="flex flex-col">
					<div
						class="w-full justify-center xs:justify-end my-2 sm:my-0 flex flex-row flex-wrap gap-2 items-center"
					>
						{#if isNsfw}
							<div
								class="rounded-lg text-white uppercase flex flex-row items-center justify-center h-7 text-xs px-4
					bg-gradient-to-b from-pink-500 to-pink-600"
							>
								nsfw
							</div>
						{/if}

						{#if anime.status}
							<AnimeStatusBadge status={anime.status} />
						{/if}

						{#if anime.media_type}
							<AnimeMediaTypeBadge mediaType={anime.media_type} />
						{/if}

						{#if anime.start_season}
							<SeasonAndYearIndicator
								season={anime.start_season.season}
								year={anime.start_season.year}
							/>
						{/if}
					</div>

					<div class="items-center justify-between border-b-4 border-b-orange-500 mb-4">
						<h1
							class="text-xl mb-2 sm:mb-0 md:text-3xl !leading-[1.3em] sm:!leading-[2em] text-white text-center lg:text-left"
						>
							{anime.title}
						</h1>
					</div>
				</div>
			</section>

			<section class="flex flex-col items-center md:items-start md:flex-row justify-around gap-4">
				<div class="w-full md:w-1/3 overflow-hidden">
					<img
						src={AnimeHelper.getImage({ node: anime })}
						alt={anime.title}
						class={`w-full mx-auto md:w-auto h-[300px] md:h-[400px] object-contain transition duration-200 ${
							shouldCensor && !showUncensored ? 'blur-lg' : 'blur-0'
						}`}
						data-anime-image
						style={`--anime-id: anime-${anime.id};`}
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
									{#if anime.mean != null && anime.mean > 0}
										<AnimatedNumber value={anime.mean} decimalPlaces={2} />
									{:else}
										N/A
									{/if}
								</svelte:fragment>

								<svelte:fragment slot="right">
									<span class="text-sm md:text-2xl">Score</span>
									<span class="text-xs">{`${anime.num_scoring_users.toLocaleString()} users`}</span>
								</svelte:fragment>
							</AnimeStatBadge>

							<AnimeStatBadge class="bg-gradient-to-br from-orange-500 to-orange-600">
								<svelte:fragment slot="left">
									{#if anime.rank != null && anime.rank > 0}
										#<AnimatedNumber value={anime.rank} />
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
									{#if anime.popularity}
										#<AnimatedNumber value={anime.popularity} />
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
						<p class="text-white text-sm text-justify">
							{`${anime.synopsis || 'N/A'}`}
						</p>
					</div>

					<div class="pb-5">
						<h3 class="text-orange-500 text-2xl mb-2">Genres</h3>
						<div class="flex flex-row flex-wrap gap-4">
							{#each (anime.genres || []) as genre}
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
							{#if anime.status == 'not_yet_aired'}
								<span>{`Release date `}</span>
								<span class="text-orange-500">
									{#if anime.start_date}
										{dayjs(anime.start_date).format('LL')}
									{:else}
										Unknown
									{/if}
								</span>
							{:else if anime.status == 'currently_airing'}
								<span>{`Airing since `}</span>
								<span class="text-orange-500">{dayjs(anime.start_date).format('LL')}</span>
							{:else if anime.start_date == anime.end_date}
								<span>{`Aired on `}</span>
								<span class="text-orange-500">{dayjs(anime.start_date).format('LL')}</span>
							{:else}
								{#if anime.start_date}
									<span>{`Aired from `}</span>
									<span class="text-orange-500">{dayjs(anime.start_date).format('LL')}</span>
								{/if}

								{#if anime.end_date}
									<span>{` to `}</span>
									<span class="text-orange-500">{dayjs(anime.end_date).format('LL')}</span>
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
							<div in:slide>
								<MyAnimeListInput
									anime={{ node: anime }}
									episodesSeen={anime.my_list_status?.num_episodes_watched}
									numEpisodes={anime.num_episodes}
									myScore={anime.my_list_status?.score}
									status={anime.my_list_status?.status}
									canDelete={isInMyList}
									on:delete={() => {
										isInMyList = false;
										openMyAnimeList = false;
									}}
									on:save={() => {
										isInMyList = true;
									}}
								/>
							</div>
						</div>
					{:else}
						<div class="bg-black/40 mt-8 mb-4 px-8 pb-8 pt-2 rounded-lg">
							<h1 class="text-white mb-12 mt-4 text-3xl">My List Status</h1>
							<div class="w-full justify-center">
								<Button on:click={addToFavorites} class="flex flex-row gap-2 w-full">
									<StarSolid />
									<span>Add to List</span>
								</Button>
							</div>
						</div>
					{/if}
				</section>
			{/if}

			<section class="flex flex-col">
				<Tabs
					divider={false}
					contentClass="bg-transparent py-4 overflow-hidden"
					activeClasses="p-4 text-white bg-violet-500 rounded-t-lg"
					inactiveClasses="p-4 text-violet-300 rounded-t-lg hover:text-white hover:bg-violet-500"
					defaultClass="text-indigo-500 mt-5 flex flex-row w-full flex-wrap border-b-2 gap-2 border-b-violet-500"
				>
					<TabItem open title="General">
						<div in:fly|global={{ duration: 200, x: -100 }}>
							{#if anime.alternative_titles}
								<h3 class="text-white font-bold text-xl mb-1">Alternative Titles</h3>

								{#if anime.alternative_titles.en}
									<AnimeInfoRow title="English">
										<span slot="content">{anime.alternative_titles.en}</span>
									</AnimeInfoRow>
								{/if}

								{#if anime.alternative_titles.ja}
									<AnimeInfoRow title="Japanese">
										<span slot="content">{anime.alternative_titles.ja}</span>
									</AnimeInfoRow>
								{/if}

								{#if anime.alternative_titles.synonyms && anime.alternative_titles.synonyms.length > 0}
									<AnimeInfoRow title="Synonyms">
										<svelte:fragment slot="content">
											{#if anime.alternative_titles.synonyms}
												{#each anime.alternative_titles.synonyms as synonym}
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
									{AnimeHelper.mediaTypeToString(anime.media_type)}
								</svelte:fragment>
							</AnimeInfoRow>

							<AnimeInfoRow title="Episodes">
								<span slot="content">{anime.num_episodes || 'Unknown'}</span>
							</AnimeInfoRow>

							<AnimeInfoRow title="Status">
								<span slot="content"> {AnimeHelper.airingStatusToString(anime.status)}</span>
							</AnimeInfoRow>

							{#if anime.average_episode_duration}
								<AnimeInfoRow title="Episode Duration">
									<span slot="content">{getDurationFormatted(anime.average_episode_duration)}</span>
								</AnimeInfoRow>
							{/if}

							{#if anime.source}
								<AnimeInfoRow title="Source">
									<span slot="content">{AnimeHelper.sourceTypeToString(anime.source)}</span>
								</AnimeInfoRow>
							{/if}

							{#if anime.studios && anime.studios.length > 0}
								<AnimeInfoRow title="Studios">
									<svelte:fragment slot="content">
										{#each anime.studios as studio}
											<span>{studio.name}</span>
										{/each}
									</svelte:fragment>
								</AnimeInfoRow>
							{/if}

							{#if anime.rating}
								<AnimeInfoRow title="Rating">
									<span slot="content">{AnimeHelper.ratingToString(anime.rating)}</span>
								</AnimeInfoRow>
							{/if}

							{#if anime.nsfw}
								<AnimeInfoRow title="NSFW">
									<svelte:fragment slot="content">
										{#if anime.nsfw === 'black'}
											<span class="text-pink-600">This work is not safe for work</span>
										{:else if anime.nsfw === 'gray'}
											<span class="text-pink-300">This work may be not safe for work</span>
										{:else if anime.nsfw === 'white'}
											<span class="text-yellow-50">This work is safe for work</span>
										{/if}
									</svelte:fragment>
								</AnimeInfoRow>
							{/if}

							{#if anime.related_anime && anime.related_anime.length > 0}
								<div>
									<h3 class="text-white text-xl mt-8 mb-3 font-bold">Related Anime</h3>
									<div class="bg-black/20 p-2 rounded-lg">
										<AnimeCarousel
											animeList={anime.related_anime}
											autoPlay={anime.related_anime.length >= 10}
											showNsfw={showUncensored}
											mapTitle={(anime) => {
												return `${anime.node.title} (${anime.relation_type_formatted})`;
											}}
										/>
									</div>
								</div>
							{/if}

							{#if anime.recommendations && anime.recommendations.length > 0}
								<div>
									<h3 class="text-white text-xl mt-8 mb-3 font-bold">Recommendations</h3>
									<div class="bg-black/20 p-2 rounded-lg">
										<AnimeCarousel
											animeList={anime.recommendations}
											autoPlay={anime.recommendations.length >= 10}
										/>
									</div>
								</div>
							{/if}
						</div>
					</TabItem>

					<TabItem title="Pictures">
						{#if anime.pictures}
							<div
								class="flex flex-row justify-center flex-wrap gap-4"
								in:fly|global={{ duration: 200, x: 100 }}
							>
								{#each anime.pictures as picture}
									<img
										alt={anime.title}
										src={picture.large}
										class={`object-contain w-[300px] h-[500px] overflow-hidden ${
											shouldCensor && !showUncensored ? 'blur-lg' : 'blur-0'
										}`}
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
	</PageTransition>
{/key}
