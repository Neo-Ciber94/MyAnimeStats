<script lang="ts">
	import 'swiper/css/bundle';
	import { goto } from '$app/navigation';
	import session from '$stores/session';
	import { signIn } from '@/lib/myanimelist/auth/client';
	import { Button, ChevronLeft, ChevronRight } from 'flowbite-svelte';
	import { HeartSolid } from 'flowbite-svelte-icons';
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { getCurrentAnimeSeason } from '@/lib/myanimelist/common/types';
	import { capitalize } from '@/lib/utils/helpers';

	export let data: PageServerData;
	let swiperElement: HTMLDivElement;
	let swiper: Swiper;

	const animeSeason = getCurrentAnimeSeason();

	onMount(() => {
		swiper = new Swiper(swiperElement, {
			loop: true,
			spaceBetween: 5,
			slidesPerView: 5,
			centeredSlides: true,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			}
		});
	});

	function handleSlideNext() {
		if (swiper) {
			swiper.slideNext();
		}
	}

	function handleSlidePrev() {
		if (swiper) {
			swiper.slidePrev();
		}
	}

	const handleConnect = () => {
		if ($session.loading) {
			return;
		}

		if (!$session.user) {
			signIn();
		} else {
			goto('/stats');
		}
	};
</script>

<svelte:head>
	<script defer src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-element-bundle.min.js"></script>
</svelte:head>

<div class="relative p-4 container mx-auto">
	<!-- <div class="flex flex-col lg:flex-row items-center mt-10 gap-10 px-44">
		<SampleBarGraph class="w-[45%]  justify-end"/>

		<section
			class="w-[55%] flex flex-col justify-center pb-4 text-3xl lg:text-[4vw] leading-[1.3em] text-white mt-10 text-center md:text-left"
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
			bg-gradient-to-r from-pink-700 from-10% to-pink-500">Why?</span
				>
				<span>
					<span>Just for</span>
					<span
						class="font-extrabold text-transparent bg-clip-text
				bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600">FUN</span
					>
				</span>
			</div>
		</section>
	</div> -->

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

	<section class="px-10 py-4 text-center">
		<Button
			color="purple"
			class="px-20 text-white text-lg md:text-2xl w-full sm:w-64"
			on:click={handleConnect}
		>
			<span>Connect</span>
			<HeartSolid class="ml-3 w-5 h-5" />
		</Button>
	</section>

	<section class="px-10 py-4">
		<h1 class="text-3xl text-white mb-4 border-b-4 border-b-orange-500 leading-[2.5em]">
			{`${capitalize(animeSeason.season)} ${animeSeason.year} anime`}
		</h1>

		<!-- Slider main container -->
		<div class="swiper group" bind:this={swiperElement}>
			<!-- Additional required wrapper -->
			<div class="swiper-wrapper">
				<!-- Slides -->
				{#each data.animeList as anime}
					<div class="swiper-slide overflow-hidden relative border border-gray-500/20 rounded-sm">
						<div class="w-full h-full absolute bg-gradient-to-t to-40% from-black to-transparent" />
						<img
							class="object-cover w-[220px] h-[220px] lg:w-[400px] lg:h-[400px]"
							alt={anime.node.title}
							src={anime.node.main_picture.medium}
						/>
						<span class="absolute inset-x-0 bottom-2 text-center text-white text-xs font-thin">
							{anime.node.title}
						</span>
					</div>
				{/each}
			</div>

			<div
				class="absolute h-full top-0 left-0 w-8 bg-black/70 z-30
					group-hover:opacity-100 opacity-0 transition duration-500
					flex flex-row justify-center items-center"
			>
				<button on:click={handleSlidePrev}>
					<ChevronLeft class="w-6 h-6 text-white" />
				</button>
			</div>
			<div
				class="absolute h-full top-0 right-0 w-8 bg-black/70 z-30
					group-hover:opacity-100 opacity-0 transition duration-500
					flex flex-row justify-center items-center"
			>
				<button on:click={handleSlideNext}>
					<ChevronRight class="w-6 h-6 text-white" />
				</button>
			</div>
		</div>
	</section>
</div>
