<script lang="ts">
	import session from '$stores/sessionStore';
	import { Spinner } from 'flowbite-svelte';
	import StatIndicator from '$components/StatIndicator.svelte';

	let open = false;
</script>

<div
	class={`w-11/12 overflow-hidden md:w-[300px] shrink-0 bg-gradient-to-tl
		from-indigo-600 from-10 to-indigo-800 mx-auto my-2 md:my-4 md:mx-4 md:min-h-screen shadow-lg 
		px-4 py-10 flex flex-row md:flex-col items-center rounded-2xl gap-4 md:gap-0`}
>
	{#if $session.loading}
		<div class="w-full h-full text-center">
			<Spinner bg="transparent" />
		</div>
	{:else if $session.user}
		<div class="flex flex-col gap-2 md:gap-4 items-center mr-5 md:mr-0">
			<div class="aspect-square w-24 h-24 md:w-36 md:h-36">
				<img
					class="border-4 md:border-8 border-white/30 shadow-md w-full h-full
						object-cover overflow-hidden rounded-full"
					width={0}
					height={0}
					src={$session.user.picture}
					alt={$session.user.name}
				/>
			</div>

			<span class="text-white font-bold text-lg md:text-2xl">{$session.user.name}</span>
		</div>

		<div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 gap-4 w-full mt-5">
			<StatIndicator color="rgb(49 196 141)">
				<span slot="count" class="text-white"
					>{$session.user.anime_statistics?.num_items_watching ?? 0}</span
				>
				<span slot="text" class="text-white text-base md:text-xl">Watching</span>
			</StatIndicator>

			<StatIndicator color="#FF8A40">
				<span slot="count" class="text-white"
					>{$session.user.anime_statistics?.num_items_completed ?? 0}</span
				>
				<span slot="text" class="text-white text-base md:text-xl">Completed</span>
			</StatIndicator>

			<StatIndicator color="#ffff00">
				<span slot="count">{$session.user.anime_statistics?.num_items_on_hold ?? 0}</span>
				<span slot="text" class="text-white text-base md:text-xl">On Hold</span>
			</StatIndicator>

			<StatIndicator color="#ff0000">
				<span slot="count" class="text-white"
					>{$session.user.anime_statistics?.num_items_dropped ?? 0}</span
				>
				<span slot="text" class="text-white text-base md:text-xl">Dropped</span>
			</StatIndicator>

			<StatIndicator color="#cfcfcf">
				<span slot="count">{$session.user.anime_statistics?.num_items_plan_to_watch ?? 0}</span>
				<span slot="text" class="text-white text-base md:text-xl">Plan To Watch</span>
			</StatIndicator>
		</div>
	{/if}
</div>
