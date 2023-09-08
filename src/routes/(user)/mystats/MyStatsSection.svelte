<script lang="ts">
	import type { CalculatedStats } from '$lib/utils/calculatePersonalStats.server';
	import { PERSONAL_STATS } from '@/common/constants';
	import StatProgress from '@/routes/(user)/mystats/StatProgress.svelte';
	import { Tooltip } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	export let stats: CalculatedStats;
</script>

<div class="flex flex-col gap-4 mt-4 w-full px-2 xl:px-20">
	<StatProgress
		max={PERSONAL_STATS.MAX_STRENGTH}
		value={stats.strength}
		containerClass="border-2 border-red-500"
		class="bg-gradient-to-r from-red-500 via-red-600 to-red-700 h-6 md:h-10"
		delay={50}
	>
		<div slot="title" class="text-white text-xl flex flex-row gap-2 items-center">
			<span>Strength</span>
			<InfoCircleSolid id="strength-info" size={'sm'} class="text-violet-400" />
			<Tooltip triggeredBy="#strength-info" class="bg-black">
				You may gain strength by watching action anime
			</Tooltip>
		</div>
		<span slot="text" class="text-white text-xl">{stats.strength}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_CHARISMA}
		value={stats.charisma}
		containerClass="border-2 border-pink-500"
		class="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600  h-6 md:h-10"
		delay={100}
	>
		<div slot="title" class="text-white text-xl flex flex-row gap-2 items-center">
			<span>Charisma</span>
			<InfoCircleSolid id="charisma-info" size={'sm'} class="text-violet-400" />
			<Tooltip triggeredBy="#charisma-info" class="bg-black">
				Make people laugh, that's charisma, right?
			</Tooltip>
		</div>
		<span slot="text" class="text-white text-xl">{stats.charisma}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_INTELLIGENCE}
		value={stats.intelligence}
		containerClass="border-2 border-purple-500"
		class="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600  h-6 md:h-10"
		delay={70}
	>
		<div slot="title" class="text-white text-xl flex flex-row gap-2 items-center">
			<span>Intelligence</span>
			<InfoCircleSolid id="intelligence-info" size={'sm'} class="text-violet-400" />
			<Tooltip triggeredBy="#intelligence-info" class="bg-black">
				Some anime may make you look intelligent
			</Tooltip>
		</div>
		<span slot="text" class="text-white text-xl">{stats.intelligence}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_VITALITY}
		value={stats.vitality}
		containerClass="border-2 border-lime-500"
		class="bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 h-6 md:h-10"
		delay={30}
	>
		<span slot="title" class="text-white text-xl flex flex-row gap-2 items-center">
			<span>Vitality</span>
			<InfoCircleSolid id="vitality-info" size={'sm'} class="text-violet-400" />
			<Tooltip triggeredBy="#vitality-info" class="bg-black">
				Boost your vitality by being active
			</Tooltip>
		</span>
		<span slot="text" class="text-white text-xl">{stats.vitality}</span>
	</StatProgress>
</div>
