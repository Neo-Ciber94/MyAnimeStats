<script lang="ts">
	import { Button, Tabs, TabItem } from 'flowbite-svelte';
	import MyStatsSection from '$components/MyStatsSection.svelte';
	import { UserSolid, ChartPieSolid, AdjustmentsVerticalOutline } from 'flowbite-svelte-icons';
	import ChartSection from '$components/ChartSection.svelte';
	import type { CalculatedStats } from '$lib/types';

	export let stats: CalculatedStats;
</script>

<div class="w-full mt-10 p-4 flex flex-col justify-center items-center h-full">
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
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartPieSolid class="h-4 w-4" />
				Charts
			</div>
			<ChartSection />
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
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
				<span>Contacts</span>
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Contacts:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</p>
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<AdjustmentsVerticalOutline class="h-4 w-4" />
				<span>Settings</span>
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Settings:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</p>
		</TabItem>
	</Tabs>
</div>
