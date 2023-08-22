<script lang="ts">
	export let title: string;
</script>

<div class="information-grid">
	<div class="text-orange-500 text-sm sm:text-base min-w-[130px]">{title}</div>
	<div class="flex flex-col spacing-y-4 text-white text-sm sm:text-base">
		<slot name="content" />
	</div>
</div>

<style lang="postcss">
	.information-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: auto 1fr;
		align-items: center;

		@apply mb-2 sm:mb-1;
	}
</style>
