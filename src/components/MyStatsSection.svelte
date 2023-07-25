<script>
	import StatProgress from './StatProgress.svelte';
</script>

<div class="flex flex-col gap-4 mt-4 w-full px-2 xl:px-20">
	<StatProgress max={120} value={80} class="bg-red-700 h-10" delay={50}>
		<span slot="title" class="text-white text-xl">Strength</span>
		<span slot="text" class="text-white text-xl">80</span>
	</StatProgress>

	<StatProgress max={120} value={40} class="bg-pink-400 h-10" delay={100}>
		<span slot="title" class="text-white text-xl">Charisma</span>
		<span slot="text" class="text-white text-xl">40</span>
	</StatProgress>

	<StatProgress max={120} value={5} class="bg-purple-500 h-10" delay={70}>
		<span slot="title" class="text-white text-xl">Intelligence</span>
		<span slot="text" class="text-white text-xl">5</span>
	</StatProgress>

	<StatProgress max={300} value={250} class="bg-lime-500 h-10" delay={30}>
		<span slot="title" class="text-white text-xl">Vitality</span>
		<span slot="text" class="text-white text-xl">250</span>
	</StatProgress>
</div>
