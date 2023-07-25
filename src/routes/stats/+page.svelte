<script lang="ts">
	import session from '$stores/sessionStore';
	import { Button, Tabs, TabItem, Spinner } from 'flowbite-svelte';
	import StatIndicator from '$components/StatIndicator.svelte';
	import MyStatsSection from '$components/MyStatsSection.svelte';
	import { UserSolid, ChartPieSolid } from 'flowbite-svelte-icons';
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
					<span slot="text" class="text-white">Watching</span>
				</StatIndicator>

				<StatIndicator color="#FF8A40">
					<span slot="count" class="text-white"
						>{$session.user.anime_statistics.num_items_completed}</span
					>
					<span slot="text" class="text-white">Completed</span>
				</StatIndicator>

				<StatIndicator color="#ffff00">
					<span slot="count">{$session.user.anime_statistics.num_items_on_hold}</span>
					<span slot="text" class="text-white">On Hold</span>
				</StatIndicator>

				<StatIndicator color="#ff0000">
					<span slot="count" class="text-white"
						>{$session.user.anime_statistics.num_items_dropped}</span
					>
					<span slot="text" class="text-white">Dropped</span>
				</StatIndicator>

				<StatIndicator color="#cfcfcf">
					<span slot="count">{$session.user.anime_statistics.num_items_plan_to_watch}</span>
					<span slot="text" class="text-white">Plan To Watch</span>
				</StatIndicator>
			</div>
		{/if}
	</div>

	<div class="w-full mt-10 p-4 flex flex-col justify-center items-center h-full">
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

		<Tabs
			style="underline"
			activeClass="text-indigo-500"
			contentClass="bg-transparent w-full pt-10"
			defaultClass="text-indigo-500 mt-5 flex flex-row justify-around w-full"
		>
			<TabItem
				defaultClass="min-w-[100px] flex flex-row justify-center"
				activeClasses="border-b-2 p-4 border-indigo-500"
				open
			>
				<div slot="title" class="flex items-center gap-2">
					<UserSolid class="h-4 w-4" />
					<span>Me</span>
				</div>

				<MyStatsSection />
			</TabItem>
			<TabItem
				defaultClass="min-w-[100px] flex flex-row justify-center"
				activeClasses="border-b-2 p-4 border-indigo-500"
				open
			>
				<div slot="title" class="flex items-center gap-2">
					<ChartPieSolid class="h-4 w-4" />
					Graphs
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					<b>Dashboard:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua.
				</p>
			</TabItem>

			<TabItem
				defaultClass="min-w-[100px] flex flex-row justify-center"
				activeClasses="border-b-2 p-4 border-indigo-500"
				open
			>
				<div slot="title" class="flex items-center gap-2">
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path
							fill-rule="evenodd"
							d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
							clip-rule="evenodd"
						/></svg
					>
					Contacts
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					<b>Contacts:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua.
				</p>
			</TabItem>

			<TabItem
				defaultClass="min-w-[100px] flex flex-row justify-center"
				activeClasses="border-b-2 p-4 border-indigo-500"
				open
			>
				<div slot="title" class="flex items-center gap-2">
					<svg
						aria-hidden="true"
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
						/></svg
					>
					Settings
				</div>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					<b>Settings:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua.
				</p>
			</TabItem>
		</Tabs>
	</div>
</div>
