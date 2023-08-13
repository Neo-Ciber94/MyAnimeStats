<script>
	import { Button } from 'flowbite-svelte';

	function handleConnect() {
		
	}
</script>

<div class="p-4 container mx-auto">
	<!-- <section class="flex flex-row gap-4 my-4 px-32">
		<div class="basis-1/3">
			<img
				alt="Mirai in Phone"
				width="600"
				height="600"
				class="w-full h-full aspect-square object-cover shadow-md rounded-md overflow-hidden"
				src="/images/mirai_in_phone.jpg"
			/>
		</div>

		<div class="text-white text-7xl basis-2/3">
			<div class="flex flex-col gap-4">
				<span>Want to analyze your <b>MyAnimeList</b> stats? </span>
				<span>Just for fun</span>
			</div>
		</div>
	</section> -->

	<section
		class="flex flex-col justify-center pt-20 pb-4 px-20 gap-4 text-6xl text-white items-center"
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
		<Button color="purple" size="lg" class="px-20 text-white text-2xl">Connect</Button>
	</section>
</div>
