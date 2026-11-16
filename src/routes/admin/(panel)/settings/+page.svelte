<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';
	import { SETTING_FIELDS } from '$lib/settings';

	let { data, form } = $props();
</script>

<h1 class="font-display text-4xl font-black">Site info</h1>
<p class="mb-4 text-ink-soft">Contact details, social links, the About text, and an optional announcement banner.</p>

<FormMessage {form} />

<form method="POST" use:enhance class="card space-y-4">
	{#each SETTING_FIELDS as field (field.key)}
		<div>
			<label class="label" for="s-{field.key}">{field.label}</label>
			{#if field.type === 'textarea'}
				<textarea id="s-{field.key}" name={field.key} rows="8" class="input">{data.settings[field.key] ?? ''}</textarea>
			{:else}
				<input id="s-{field.key}" name={field.key} class="input" value={data.settings[field.key] ?? ''} />
			{/if}
			{#if field.hint}<p class="mt-1 text-xs text-ink-soft">{field.hint}</p>{/if}
		</div>
	{/each}
	<button class="btn btn-pink">Save</button>
</form>
