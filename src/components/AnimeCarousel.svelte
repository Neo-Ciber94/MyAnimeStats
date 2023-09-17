<script lang="ts" generics="TAnime extends AnimeObject">
	import { PLACEHOLDER_IMAGE } from '@/common/constants';

	import 'swiper/css/bundle';
	import Swiper from 'swiper';
	import { AnimeHelper } from '@/lib/myanimelist/common/helper';
	import type { SwiperModule } from 'swiper/types/shared';
	import { ChevronLeft, ChevronRight } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Autoplay } from 'swiper/modules';
	import type { AnimeObject } from '@/lib/myanimelist/common/types';

	export let animeList: TAnime[];
	export let initialSlide = 1;
	export let autoPlay = true;
	export let showNsfw = true;
	export let mapTitle: (anime: TAnime) => string = (anime) => {
		return anime.node.title;
	};

	let swiperElement: HTMLDivElement;
	let swiper: Swiper;

	onMount(() => {
		const modules: SwiperModule[] = [];

		if (autoPlay) {
			modules.push(Autoplay);
		}

		swiper = new Swiper(swiperElement, {
			speed: 500,
			loop: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			spaceBetween: 10,
			initialSlide,
			modules,
			autoplay: {
				delay: 2500,
				pauseOnMouseEnter: true,

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

	function handleImgError(event: Event & { currentTarget: EventTarget & Element }) {
		const el = event.currentTarget as HTMLImageElement;
		el.src = PLACEHOLDER_IMAGE;
	}
</script>

<div class={`swiper group h-[200px] sm:h-[300px]`} bind:this={swiperElement}>
	{#if swiper == null}
		<div class="flex flex-row space-x-[10px]">
			{#each Array.from(Array(10).keys()) as _}
				<div
					class="flex-shrink-0 rounded-sm w-[130px] h-[200px] sm:w-[200px] sm:h-[300px] bg-indigo-400/20 animate-pulse"
				/>
			{/each}
		</div>
	{/if}

	<!-- We hide the wrapper until the page is loaded -->
	<div class={`swiper-wrapper ${swiper == null ? 'invisible' : 'visible'}`}>
		<!-- Slides -->
		{#each animeList as anime}
			<div class="swiper-slide !w-[130px] !h-[200px] sm:!w-[200px] sm:!h-[300px] cursor-pointer">
				<a
					href={`/anime/${anime.node.id}`}
					class="group/image block overflow-hidden relative border border-gray-500/20 rounded-sm w-full h-full mx-auto"
					on:click={(e) => {
						// We need to set the name here because we could have multiple carousels
						// causing the transition-name to be repeated, setting the name this way
						// also will provoke to loss the animation when navigating back
						const img = e.currentTarget.querySelector('img');
						if (img && typeof img.style.viewTransitionName !== 'undefined') {
							img.style.viewTransitionName = `anime-${anime.node.id}`;
						}
					}}
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
						data-anime-image
						width={0}
						height={0}
						on:error={handleImgError}
						alt={anime.node.title}
						src={AnimeHelper.getImage(anime)}
						class={`object-cover w-full h-full ${
							AnimeHelper.shouldCensor(anime) && !showNsfw ? 'blur-md' : ''
						}`}
					/>

					<!-- Title -->
					<span
						class="absolute inset-x-0 bottom-2 text-center text-white text-[10px] sm:text-xs font-thin px-1 z-40"
					>
						{mapTitle(anime)}
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
