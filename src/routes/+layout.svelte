<script>
	import '../app.css';
	import Footer from '../layout/Footer.svelte';
	import Header from '../layout/Header.svelte';
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

		* {
			font-family: 'Roboto', sans-serif;
			font-family: 'Ubuntu', sans-serif;
		}
	</style>

	<title>MyAnimeStats</title>
</svelte:head>

<div class="flex flex-col justify-between min-h-screen">
	<Header />

	<div class="container mx-auto p-4 h-full">
		<slot />
	</div>

	<Footer />
</div>
