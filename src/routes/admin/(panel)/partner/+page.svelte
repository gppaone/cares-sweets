<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';
	import ItemEditor from '$lib/components/ItemEditor.svelte';
	import PhotoSlot from '$lib/components/PhotoSlot.svelte';

	let { data, form } = $props();

	const enabled = $derived(data.settings.partner_enabled === 'true');
</script>

<h1 class="font-display text-4xl font-black">Guest baker section</h1>
<p class="mb-4 text-ink-soft">
	Breads and pastries from Joe's Dough to Go. Switch it on when you have them, off when you don't. Your items are kept while it's hidden.
</p>

<FormMessage {form} />

<form method="POST" action="?/info" use:enhance class="card mb-8 space-y-4">
	<label class="flex items-center gap-3 rounded-2xl border-2 border-ink px-4 py-3 text-lg font-extrabold {enabled ? 'bg-emerald-50' : 'bg-white'}">
		<input type="checkbox" name="partner_enabled" checked={enabled} class="size-6 accent-bubblegum" />
		Show this section on the website
	</label>

	<div>
		<label class="label" for="p-name">Section name</label>
		<input id="p-name" name="partner_name" class="input" required maxlength="80" value={data.settings.partner_name ?? ''} />
	</div>
	<div>
		<label class="label" for="p-note">Availability note (optional)</label>
		<input id="p-note" name="partner_note" class="input" maxlength="200" value={data.settings.partner_note ?? ''} placeholder="This weekend only, while supplies last" />
		<p class="mt-1 text-xs text-ink-soft">Shown as a highlighted tag at the top of the section.</p>
	</div>
	<div>
		<label class="label" for="p-blurb">Intro text</label>
		<textarea id="p-blurb" name="partner_blurb" rows="3" class="input" maxlength="1000">{data.settings.partner_blurb ?? ''}</textarea>
	</div>
	<button class="btn btn-pink">Save</button>
</form>

<div class="mb-8 max-w-md">
	<PhotoSlot image={data.photo ?? undefined} kind="partner" slot={0} label="Section photo" altLabel="Photo description" altPlaceholder="Fresh sourdough loaves" />
</div>

<ItemEditor items={data.items} listId="joes-categories" namePlaceholder="Cinnamon Rolls" categoryPlaceholder="Pastries" />
