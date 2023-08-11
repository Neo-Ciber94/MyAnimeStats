<script lang="ts">
	import type { CalculatedStats } from '$lib/types';
	import { PERSONAL_STATS } from '@/common/constants';
	import StatProgress from './StatProgress.svelte';

	export let stats: CalculatedStats;
	const { personal } = stats;
</script>

<div class="flex flex-col gap-4 mt-4 w-full px-2 xl:px-20">
	<StatProgress
		max={PERSONAL_STATS.MAX_STRENGTH}
		value={personal.strength}
		class="bg-red-700 h-6 md:h-10"
		delay={50}
	>
		<span slot="title" class="text-white text-xl">Strength</span>
		<span slot="text" class="text-white text-xl">{personal.strength}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_CHARISMA}
		value={personal.charisma}
		class="bg-pink-400 h-6 md:h-10"
		delay={100}
	>
		<span slot="title" class="text-white text-xl">Charisma</span>
		<span slot="text" class="text-white text-xl">{personal.charisma}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_INTELLIGENCE}
		value={personal.intelligence}
		class="bg-purple-500 h-6 md:h-10"
		delay={70}
	>
		<span slot="title" class="text-white text-xl">Intelligence</span>
		<span slot="text" class="text-white text-xl">{personal.intelligence}</span>
	</StatProgress>

	<StatProgress
		max={PERSONAL_STATS.MAX_VITALITY}
		value={personal.vitality}
		class="bg-lime-500 h-6 md:h-10"
		delay={30}
	>
		<span slot="title" class="text-white text-xl">Vitality</span>
		<span slot="text" class="text-white text-xl">{personal.vitality}</span>
	</StatProgress>
</div>
