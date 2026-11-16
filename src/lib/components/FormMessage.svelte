<script lang="ts">
	let { form }: { form?: { message?: string; error?: string } | null } = $props();
</script>

{#if form?.error}
	<p role="alert" class="mb-4 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-2 font-bold text-red-800">
		{form.error}
	</p>
{:else if form?.message}
	<p role="status" class="mb-4 rounded-xl border-2 border-emerald-700 bg-emerald-50 px-4 py-2 font-bold text-emerald-900">
		{form.message}
	</p>
{/if}
