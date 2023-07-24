<script lang="ts">
	import session from '$stores/sessionStore';
	import { Button, Spinner } from 'flowbite-svelte';
	import StatIndicator from '$components/StatIndicator.svelte';
</script>

<div class="flex flex-row h-full w-full grow">
	<div
		class="w-[300px] shrink-0 bg-gradient-to-tl from-indigo-600 from-10 to-indigo-800 m-4 min-h-screen shadow-lg px-4 py-10 flex flex-col items-center rounded-2xl"
	>
		{#if $session.loading}
			<div class="w-full h-full text-center">
				<Spinner bg="transparent" />
			</div>
		{:else if $session.user}
			<div>
				<img
					class="border-8 border-white/30 shadow-md w-36 h-36 object-cover overflow-hidden rounded-full"
					width={0}
					height={0}
					src={$session.user.picture}
					alt={$session.user.name}
				/>
			</div>

			<span class="text-white font-bold text-2xl mt-4">{$session.user.name}</span>

			<div class="flex flex-col gap-4 w-full mt-5">
				<StatIndicator color="rgb(49 196 141)">
					<span slot="count" class="text-white"
						>{$session.user.anime_statistics.num_items_watching}</span
					>
					<span slot="text">Watching</span>
				</StatIndicator>

				<StatIndicator color="#FF8A40">
					<span slot="count" class="text-white"
						>{$session.user.anime_statistics.num_items_completed}</span
					>
					<span slot="text">Completed</span>
				</StatIndicator>

				<StatIndicator color="#ffff00">
					<span slot="count">{$session.user.anime_statistics.num_items_on_hold}</span>
					<span slot="text">On Hold</span>
				</StatIndicator>

				<StatIndicator color="#ff0000">
					<span slot="count" class="text-white"
						>{$session.user.anime_statistics.num_items_dropped}</span
					>
					<span slot="text">Dropped</span>
				</StatIndicator>

				<StatIndicator color="#cfcfcf">
					<span slot="count">{$session.user.anime_statistics.num_items_plan_to_watch}</span>
					<span slot="text">Plan To Watch</span>
				</StatIndicator>
			</div>
		{/if}
	</div>

	<div class="w-full mt-10 p-4 flex flex-row justify-center items-center h-full">
		<Button size="lg" color="purple" class="text-xl flex flex-row items-center gap-3">
			<svg
				class="w-5 h-5 text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 18 16"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1v14h16m0-9-3-2-3 5-3-2-3 4"
				/>
			</svg>

			<span>Calculate Stats</span>
		</Button>
	</div>
</div>
