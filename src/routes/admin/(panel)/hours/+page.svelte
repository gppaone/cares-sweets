<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';
	import { DAYS, WEEK_ORDER } from '$lib/hours';

	let { data, form } = $props();

	const rows = $derived(WEEK_ORDER.map((d) => data.hours.find((h) => h.day === d)).filter((r) => !!r));
</script>

<h1 class="font-display text-4xl font-black">Hours</h1>
<p class="mb-4 text-ink-soft">Type hours however you like, for example "11:00 AM – 6:00 PM". Tick Closed for days off.</p>

<FormMessage {form} />

<form method="POST" use:enhance class="card space-y-3">
	{#each rows as row (row!.day)}
		<div class="flex flex-wrap items-center gap-3 border-b border-ink/10 pb-3 last:border-0">
			<label class="w-28 font-extrabold" for="hours-{row!.day}">{DAYS[row!.day]}</label>
			<input id="hours-{row!.day}" name="hours_{row!.day}" class="input !w-auto min-w-48 flex-1" value={row!.hours} />
			<label class="flex items-center gap-2 font-bold">
				<input type="checkbox" name="closed_{row!.day}" checked={row!.closed} class="size-5 accent-bubblegum" /> Closed
			</label>
		</div>
	{/each}
	<button class="btn btn-pink">Save hours</button>
</form>
