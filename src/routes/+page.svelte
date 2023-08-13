<script lang="ts">
	import { goto } from '$app/navigation';
	import SampleBarGraph from '$components/SampleBarGraph.svelte';
	import session from '$stores/session';
	import { signIn } from '@/lib/myanimelist/auth/client';
	import { Button } from 'flowbite-svelte';
	import { HeartSolid } from 'flowbite-svelte-icons';

	const handleConnect = () => {
		if ($session.loading) {
			return;
		}

		if (!$session.user) {
			signIn();
		} else {
			goto('/stats');
		}
	};
</script>

<div class="relative p-4 container mx-auto">
	<!-- <div class="flex flex-col lg:flex-row items-center mt-10 gap-10 px-44">
		<SampleBarGraph class="w-[45%]  justify-end"/>

		<section
			class="w-[55%] flex flex-col justify-center pb-4 text-3xl lg:text-[4vw] leading-[1.3em] text-white mt-10 text-center md:text-left"
		>
			<div>
				<span>Want to analyze your</span>
				<b
					class="font-extrabold text-transparent bg-clip-text
				bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"
				>
					MyAnimeList
				</b>
				<span>stats?</span>
			</div>
			<div>
				<span
					class="font-extrabold text-transparent bg-clip-text
			bg-gradient-to-r from-pink-700 from-10% to-pink-500">Why?</span
				>
				<span>
					<span>Just for</span>
					<span
						class="font-extrabold text-transparent bg-clip-text
				bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600">FUN</span
					>
				</span>
			</div>
		</section>
	</div> -->

	<section
		class="flex flex-col justify-center pb-4 text-3xl lg:text-[4vw] leading-[1.3em] text-white mt-10 text-center"
	>
		<div>
			<span>Want to analyze your</span>
			<b
				class="font-extrabold text-transparent bg-clip-text
		bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"
			>
				MyAnimeList
			</b>
			<span>stats?</span>
		</div>
		<div>
			<span
				class="font-extrabold text-transparent bg-clip-text
	bg-gradient-to-r from-pink-700 from-10% to-pink-500">Why?</span
			>
			<span>
				<span>Just for</span>
				<span
					class="font-extrabold text-transparent bg-clip-text
		bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600">FUN</span
				>
			</span>
		</div>
	</section>

	<div class="bg-violet-500 h-1 rounded-lg w-8/12 mt-14 mb-8 mx-auto" />

	<section class="px-10 py-4 text-center">
		<Button color="purple" size="lg" class="px-20 text-white text-2xl" on:click={handleConnect}>
			Connect

			<HeartSolid class="ml-3 w-5 h-5" />
		</Button>
	</section>
</div>
