<script>
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
</script>

<div class="flex flex-col justify-between min-h-screen">
	<Header />
	<div class="flex-grow">
		<slot />
	</div>
	<Footer />
</div>
