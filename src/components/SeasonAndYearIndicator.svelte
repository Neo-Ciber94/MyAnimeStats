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

	const particlesConfig: ParticlesConfig = {
		fpsLimit: 60,
		interactivity: {
			events: {
				onClick: {
					enable: true,
					mode: 'emitter'
				}
			},
			modes: {
				emitters: {
					direction: 'none',
					spawnColor: {
						value: '#ff0000',
						animation: {
							h: {
								enable: true,
								offset: {
									min: -1.4,
									max: 1.4
								},
								speed: 0.1,
								sync: false
							},
							l: {
								enable: true,
								offset: {
									min: 20,
									max: 80
								},
								speed: 0,
								sync: false
							}
						}
					},
					life: {
						count: 1,
						duration: 0.1,
						delay: 0.6
					},
					rate: {
						delay: 0.1,
						quantity: 100
					},
					size: {
						width: 0,
						height: 0
					}
				}
			}
		},
		particles: {
			number: {
				value: 0
			},
			color: {
				value: '#f00'
			},
			shape: {
				type: ['circle', 'square', 'polygon'],
				options: {
					polygon: {
						sides: 6
					}
				}
			},
			opacity: {
				value: { min: 0, max: 1 },
				animation: {
					enable: true,
					speed: 1,
					startValue: 'max',
					destroy: 'min'
				}
			},
			size: {
				value: { min: 3, max: 7 }
			},
			life: {
				duration: {
					sync: true,
					value: 7
				},
				count: 1
			},
			move: {
				enable: true,
				gravity: {
					enable: true
				},
				drift: {
					min: -2,
					max: 2
				},
				speed: { min: 10, max: 30 },
				decay: 0.1,
				direction: 'none',
				random: false,
				straight: false,
				outModes: {
					default: 'destroy',
					top: 'none'
				}
			},
			rotate: {
				value: {
					min: 0,
					max: 360
				},
				direction: 'random',
				move: true,
				animation: {
					enable: true,
					speed: 60
				}
			},
			tilt: {
				direction: 'random',
				enable: true,
				move: true,
				value: {
					min: 0,
					max: 360
				},
				animation: {
					enable: true,
					speed: 60
				}
			},
			roll: {
				darken: {
					enable: true,
					value: 25
				},
				enable: true,
				speed: {
					min: 15,
					max: 25
				}
			},
			wobble: {
				distance: 30,
				enable: true,
				move: true,
				speed: {
					min: -15,
					max: 15
				}
			}
		},
		detectRetina: true
	};

	let particlesInit = async (engine: Engine) => {
		// you can use main to customize the tsParticles instance adding presets or custom shapes
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		//await loadFull(engine);
		await loadSlim(engine);
	};
</script>

<Particles options={particlesConfig} {particlesInit} />

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
		@apply bg-lime-500 text-lime-950;
	}

	[data-season='summer'] {
		@apply bg-yellow-300 text-black;
	}

	[data-season='fall'] {
		@apply bg-orange-500 text-white px-2;
	}
</style>
