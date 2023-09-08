<script lang="ts">
	import session from '$stores/session';
	import { Spinner } from 'flowbite-svelte';
	import StatIndicator from '@/routes/(user)/mystats/StatIndicator.svelte';

	let open = false;
</script>

<div
	class={`w-11/12 overflow-hidden md:w-[240px] lg:w-[300px] shrink-0 bg-gradient-to-tl
		from-indigo-600 from-10 to-indigo-800 mx-auto my-2 md:my-4 md:mx-4 md:min-h-screen shadow-lg 
		px-4 py-4 xs:py-10 flex flex-row md:flex-col items-center rounded-2xl gap-4 md:gap-0`}
>
	{#if $session.loading}
		<div class="w-full h-full text-center">
			<Spinner bg="transparent" />
		</div>
	{:else if $session.user}
		<div class="flex flex-col gap-2 md:gap-4 items-center mr-5 md:mr-0">
			<div class="aspect-square w-14 h-14 xs:w-24 xs:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36">
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
			<a href="/mylist/@me?status=watching">
				<StatIndicator color="rgb(49 196 141)">
					<span slot="count" class="text-white">
						{$session.user.anime_statistics?.num_items_watching ?? 0}
					</span>
					<span slot="text" class="text-white text-xs xs:text-base lg:text-xl">Watching</span>
				</StatIndicator>
			</a>

			<a href="/mylist/@me?status=completed">
				<StatIndicator color="#FF8A40">
					<span slot="count" class="text-white">
						{$session.user.anime_statistics?.num_items_completed ?? 0}
					</span>
					<span slot="text" class="text-white text-xs xs:text-base lg:text-xl">Completed</span>
				</StatIndicator>
			</a>

			<a href="/mylist/@me?status=on_hold">
				<StatIndicator color="#ffff00">
					<span slot="count">{$session.user.anime_statistics?.num_items_on_hold ?? 0}</span>
					<span slot="text" class="text-white text-xs xs:text-base lg:text-xl">On Hold</span>
				</StatIndicator>
			</a>

			<a href="/mylist/@me?status=dropped">
				<StatIndicator color="#ff0000">
					<span slot="count" class="text-white">
						{$session.user.anime_statistics?.num_items_dropped ?? 0}
					</span>
					<span slot="text" class="text-white text-xs xs:text-base lg:text-xl">Dropped</span>
				</StatIndicator>
			</a>

			<a href="/mylist/@me?status=plan_to_watch">
				<StatIndicator color="#cfcfcf">
					<span slot="count">{$session.user.anime_statistics?.num_items_plan_to_watch ?? 0}</span>
					<span slot="text" class="text-white text-xs xs:text-base lg:text-xl">Plan To Watch</span>
				</StatIndicator>
			</a>
		</div>
	{/if}
</div>
