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
	import { Autoplay } from 'swiper/modules';

	export let data: PageServerData;
	let swiperElement: HTMLDivElement;
	let swiper: Swiper;

	const animeSeason = getCurrentAnimeSeason();

	onMount(() => {
		swiper = new Swiper(swiperElement, {
			speed: 500,
			loop: true,
			centeredSlides: true,
			slidesPerView: 1,
			spaceBetween: 10,
			initialSlide: 2,
			//modules: [Autoplay],
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			breakpoints: {
				320: {
					slidesPerView: 2
				},
				540: {
					slidesPerView: 3
				},
				768: {
					slidesPerView: 4
				},
				1280: {
					slidesPerView: 5
				}
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

<div class="relative p-4 md:container mx-auto">
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
		<div
			class={`swiper group ${swiper == null ? 'bg-indigo-400/20 animate-pulse rounded-lg' : ''}`}
			bind:this={swiperElement}
		>
			<!-- Additional required wrapper -->
			<div class={`swiper-wrapper ${swiper == null ? 'invisible' : 'visible'}`}>
				<!-- Slides -->
				{#each data.animeList as anime}
					<div class="swiper-slide">
						<div
							class="overflow-hidden relative border border-gray-500/20 rounded-sm
							w-[140px] h-[250px] sm:w-[160px] lg:w-[220px] lg:h-[380px] mx-auto"
						>
							<div
								class="w-full h-full absolute bg-gradient-to-t to-40% from-black to-transparent"
							/>
							<img
								class="object-cover w-[140px] sm:w-[160px] h-[250px] lg:w-[220px] lg:h-[380px]"
								alt={anime.node.title}
								src={anime.node.main_picture.large}
							/>
							<span
								class="absolute inset-x-0 bottom-2 text-center text-white text-xs font-thin px-1"
							>
								{anime.node.title}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<button
				class="absolute h-full top-0 left-0 w-8 bg-black/70 z-30
				group-hover:opacity-100 opacity-0 transition duration-500
				flex flex-row justify-center items-center"
				on:click={handleSlidePrev}
			>
				<ChevronLeft class="w-6 h-6 text-white" />
			</button>

			<button
				class="absolute h-full top-0 right-0 w-8 bg-black/70 z-30
				group-hover:opacity-100 opacity-0 transition duration-500
				flex flex-row justify-center items-center"
				on:click={handleSlideNext}
			>
				<ChevronRight class="w-6 h-6 text-white" />
			</button>
		</div>
	</section>
</div>
