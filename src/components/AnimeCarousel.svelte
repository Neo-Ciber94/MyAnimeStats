<script lang="ts">
	import 'swiper/css/bundle';
	import { ChevronLeft, ChevronRight } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay } from 'swiper/modules';
	import type { AnimeNode } from '@/lib/myanimelist/common/types';

	export let animeList: AnimeNode[];
	export let initialSlide = 1;
	
	let swiperElement: HTMLDivElement;
	let swiper: Swiper;

	onMount(() => {
		swiper = new Swiper(swiperElement, {
			speed: 500,
			loop: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			spaceBetween: 10,
			initialSlide,
			modules: [Autoplay],
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

	function handleClick(anime: AnimeNode) {}
</script>

<div class={`swiper group h-[300px]`} bind:this={swiperElement}>
	{#if swiper == null}
		<div class="flex flex-row space-x-[10px]">
			{#each Array.from(Array(10).keys()) as _}
				<div class="flex-shrink-0 rounded-sm w-[200px] h-[300px] bg-indigo-400/20 animate-pulse" />
			{/each}
		</div>
	{/if}

	<!-- We hide the wrapper until the page is loaded -->
	<div class={`swiper-wrapper ${swiper == null ? 'invisible' : 'visible'}`}>
		<!-- Slides -->
		{#each animeList as anime}
			<div class="swiper-slide !w-[200px] !h-[300px] cursor-pointer">
				<a
					href={`/anime/${anime.node.id}`}
					class="group/image block overflow-hidden relative border border-gray-500/20 rounded-sm w-full h-full mx-auto"
				>
					<!-- Hover gradient -->
					<!-- <div
						class="opacity-0  group-hover/image:opacity-100 transition duration-300
						w-full h-full absolute bg-gradient-to-r from-70% from-black mix-blend-hue to-transparent z-10"
					/> -->

					<!-- Bottom gradient -->
					<div
						class="w-full h-full absolute bg-gradient-to-t to-40% from-black to-transparent z-30"
					/>

					<!-- Image -->
					<img
						width={300}
						height={400}
						class="object-cover w-full h-full"
						alt={anime.node.title}
						src={anime.node.main_picture.large}
					/>

					<!-- Title -->
					<span
						class="absolute inset-x-0 bottom-2 text-center text-white text-xs font-thin px-1 z-40"
					>
						{anime.node.title}
					</span>
				</a>
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
