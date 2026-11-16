<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';

	let { data, form } = $props();

	function confirmDelete(e: MouseEvent) {
		if (!confirm('Delete this message?')) e.preventDefault();
	}
</script>

<h1 class="font-display text-4xl font-black">Messages</h1>
<p class="mb-4 text-ink-soft">Everything sent through the contact form on the site.</p>

<FormMessage {form} />

<div class="space-y-4">
	{#each data.messages as m (m.id)}
		<article class="card {m.is_read ? '' : '!bg-sky/30'}">
			<div class="flex flex-wrap items-baseline justify-between gap-2">
				<h2 class="font-display text-2xl font-black">
					{m.name}
					{#if !m.is_read}<span class="ml-2 rounded-full bg-ink px-2 py-0.5 align-middle font-body text-xs text-white">New</span>{/if}
				</h2>
				<time class="text-sm text-ink-soft" datetime={new Date(m.created_at).toISOString()}>
					{new Date(m.created_at).toLocaleString()}
				</time>
			</div>
			<p class="font-bold">
				<a class="underline" href="mailto:{m.email}">{m.email}</a>
				{#if m.phone}<span aria-hidden="true"> · </span>{m.phone}{/if}
			</p>
			<p class="mt-3 whitespace-pre-wrap">{m.body}</p>
			<form method="POST" use:enhance class="mt-4 flex gap-2">
				<input type="hidden" name="id" value={m.id} />
				<button formaction="?/toggle" class="btn btn-ghost !py-1.5 text-sm">{m.is_read ? 'Mark unread' : 'Mark read'}</button>
				<button formaction="?/remove" class="btn btn-danger !py-1.5 text-sm" onclick={confirmDelete}>Delete</button>
			</form>
		</article>
	{:else}
		<p class="card">No messages yet.</p>
	{/each}
</div>
