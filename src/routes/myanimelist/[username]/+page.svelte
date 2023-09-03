<script>
	import { page } from '$app/stores';

	const params = $page.params;
</script>

<pre class="flex flex-fow justify-center items-center h-[40vh] text-pink-500 text-3xl p-4">
    {JSON.stringify(params, null, 2)}
</pre>
