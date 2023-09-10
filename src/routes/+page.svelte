<script lang="ts">
	import { goto } from '$app/navigation';
	import session from '$stores/session';
	import { signIn } from '@/lib/myanimelist/auth/client';
	import { Button } from 'flowbite-svelte';
	import { HeartSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import { capitalize } from '@/lib/utils/helpers';
	import AnimeCarousel from '$components/AnimeCarousel.svelte';
	import PageTransition from '$components/PageTransition.svelte';
	import SEO from '$components/SEO.svelte';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';

	export let data: PageServerData;
	const animeSeason = AnimeHelper.getCurrentAnimeSeason();

	const handleConnect = () => {
		if ($session.loading) {
			return;
		}

		if (!$session.user) {
			signIn();
		} else {
			goto('/mystats');
		}
	};
</script>

<SEO />

<PageTransition>
	<div class="relative p-4 lg:container mx-auto">
		<section
			class="flex flex-col justify-center pb-4 text-3xl lg:text-[4vw] leading-[1.3em] text-white mt-10 text-center"
		>
			<div>
				<span>Want to analyze your</span>
				<b
					class="font-extrabold text-transparent bg-clip-text
						bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"
				>
					MyAnimeList
				</b>
				<span>stats?</span>
			</div>
			<div>
				<span
					class="font-extrabold text-transparent bg-clip-text
						bg-gradient-to-r from-pink-700 from-10% to-pink-500"
					>Why?
				</span>
				<span>
					<span>Just for</span>
					<span
						class="font-extrabold text-transparent bg-clip-text
						bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600"
					>
						FUN
					</span>
				</span>
			</div>
		</section>

		<div class="bg-violet-500 h-1 rounded-lg w-8/12 mt-14 mb-8 mx-auto" />

		<section class="px-2 sm:px-10 text-center">
			<Button
				color="purple"
				class="px-20 text-white text-lg md:text-2xl w-full sm:w-64"
				on:click={handleConnect}
			>
				<span>Connect</span>
				<HeartSolid class="ml-3 w-5 h-5" />
			</Button>
		</section>

		<section class="px-2 sm:px-10 py-4">
			<h1
				class="text-2xl sm:text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[1.5em] sm:leading-[2.5em]"
			>
				{`${capitalize(animeSeason.season)} ${animeSeason.year} anime`}
			</h1>

			<AnimeCarousel animeList={data.seasonalAnimeList} />
		</section>

		{#if data.suggestedAnimeList}
			<section class="px-2 sm:px-10 py-4">
				<h1
					class="text-2xl sm:text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[1.5em] sm:leading-[2.5em]"
				>
					{`Anime recommendations`}
				</h1>

				<AnimeCarousel animeList={data.suggestedAnimeList} />
			</section>
		{/if}

		{#if data.upcomingAnimeList.length > 0}
			<section class="px-2 sm:px-10 py-4">
				<h1
					class="text-2xl sm:text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[1.5em] sm:leading-[2.5em]"
				>
					{`Upcoming anime`}
				</h1>

				<AnimeCarousel animeList={data.upcomingAnimeList} />
			</section>
		{/if}

		<section class="px-2 sm:px-10 py-4">
			<h1
				class="text-2xl sm:text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[1.5em] sm:leading-[2.5em]"
			>
				{`Most popular anime`}
			</h1>

			<AnimeCarousel animeList={data.mostPopularAnimeList} />
		</section>
	</div>
</PageTransition>
