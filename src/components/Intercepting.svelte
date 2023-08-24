<script lang="ts">
	import { useInterceptionObserver } from '@/hooks/useInterceptionObserver';
	import { createEventDispatcher } from 'svelte';

	export let element: Element;
	export let threshold: number | undefined = undefined;

	const dispatch = createEventDispatcher<{
		intercepting: boolean;
	}>();

	const isIntercepting = useInterceptionObserver(element, {
		threshold,
		onIntercept(visible) {
			dispatch('intercepting', visible);
		}
	});
</script>

<slot intercepting={$isIntercepting} />
