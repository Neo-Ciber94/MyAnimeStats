<script lang="ts">
	import type { AnimeSeason } from '@/lib/myanimelist/common/types';
	import WinterIcon from '$assets/seasons/season-winter.svg';
	import SpringIcon from '$assets/seasons/season-spring.svg';
	import SummerIcon from '$assets/seasons/season-summer.svg';
	import FallIcon from '$assets/seasons/season-fall.svg';
	import Particles from 'svelte-particles';
	import type { Engine, Container, ISourceOptions as ParticlesConfig } from 'tsparticles-engine';
	import { loadSlim } from 'tsparticles-slim';

	export let season: AnimeSeason;
	export let year: number;

	const SEASONS: Record<AnimeSeason, { icon: any; name: string }> = {
		winter: {
			icon: WinterIcon,
			name: 'Winter'
		},
		spring: {
			icon: SpringIcon,
			name: 'Spring'
		},
		summer: {
			icon: SummerIcon,
			name: 'Summer'
		},
		fall: {
			icon: FallIcon,
			name: 'Fall'
		}
	};

	let particleContainer: Container;

	function handleClick() {
		if (particleContainer) {
			particleContainer.play();
			console.log('click');
		}
	}

	const defaults = {
		spread: 360,
		ticks: 100,
		gravity: 0,
		decay: 0.94,
		startVelocity: 30
	};

	const particlesConfig: ParticlesConfig = {
		particles: {
			...defaults,
		particleCount: 20,
		scalar: 2,
		shapes: ['text'],
		shapeOptions: {
			text: {
				value: ['🦄', '🌈']
			}
		}
		}
	};

	let particlesInit = async (engine: Engine) => {
		// you can use main to customize the tsParticles instance adding presets or custom shapes
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		//await loadFull(engine);
		await loadSlim(engine);
	};
</script>

<Particles
	options={particlesConfig}
	on:particlesLoaded={(e) => {
		const particles = e.detail?.particles;
		if (particles) {
			particles.play();
		}
	}}
	{particlesInit}
/>

<button
	on:click={handleClick}
	data-season={season}
	class="text-[13px] cursor-pointer justify-between pr-3 pl-2 flex flex-row gap-2 shadow-md items-center bg-white rounded-lg h-7 overflow-hidden"
>
	<div class="items-center h-full flex flex-row gap-1 py-1 text-center font-bold">
		<img
			class="mx-1"
			width="16"
			height="16"
			alt={SEASONS[season].name}
			src={SEASONS[season].icon}
		/>
		<div>
			{SEASONS[season].name}
		</div>
	</div>

	<span class="mx-1">•</span>
	<div class="font-bold">{year}</div>
</button>

<style lang="postcss">
	[data-season='winter'] {
		@apply bg-cyan-200  text-blue-950;
	}

	[data-season='spring'] {
		@apply bg-lime-500 text-green-950;
	}

	[data-season='summer'] {
		@apply bg-yellow-200 text-yellow-900;
	}

	[data-season='fall'] {
		@apply bg-orange-500 text-white px-2;
	}
</style>
