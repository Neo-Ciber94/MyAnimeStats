<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import MyStatsSection from '$components/MyStatsSection.svelte';
	import {
		UserSolid,
		ChartPieSolid,
		CalendarMonthSolid,
		CheckCircleSolid
	} from 'flowbite-svelte-icons';
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

			<MyStatsSection {stats}/>
		</TabItem>
		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<ChartPieSolid class="h-4 w-4" />
				Genres
			</div>
			<ChartSection />
		</TabItem>

		<TabItem
			defaultClass="min-w-[100px] flex flex-row justify-center"
			activeClasses="border-b-2 p-4 border-indigo-500"
		>
			<div slot="title" class="flex items-center gap-2">
				<CalendarMonthSolid class="h-4 w-4" />
				<span>Behaviour</span>
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
				<CheckCircleSolid class="h-4 w-4" />
				<span>Score</span>
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Settings:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</p>
		</TabItem>
	</Tabs>
</div>
