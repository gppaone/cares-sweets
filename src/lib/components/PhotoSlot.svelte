<!--
	Admin control for one fixed photo slot (upload / replace / caption / remove).
	The page must include the actions from lib/server/photo-actions.ts.
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SiteImage } from '$lib/types';

	let {
		image,
		kind,
		slot,
		label,
		altLabel = 'Caption',
		altPlaceholder = ''
	}: {
		image?: SiteImage;
		kind: 'menu' | 'about' | 'partner';
		slot: number;
		label: string;
		altLabel?: string;
		altPlaceholder?: string;
	} = $props();

	let busy = $state(false);
	const id = $derived(`${kind}-${slot}`);
</script>

<form
	method="POST"
	action="?/setSingle"
	enctype="multipart/form-data"
	class="card space-y-3"
	use:enhance={() => {
		busy = true;
		return async ({ update }) => {
			await update();
			busy = false;
		};
	}}
>
	<input type="hidden" name="kind" value={kind} />
	<input type="hidden" name="slot" value={slot} />

	<h3 class="font-display text-2xl font-black">{label}</h3>

	{#if image}
		<img src="/uploads/{image.filename}" alt={image.alt} class="aspect-[4/3] w-full max-w-xs rounded-2xl border-2 border-ink object-cover" />
	{:else}
		<p class="rounded-2xl border-2 border-dashed border-ink/40 bg-powder/40 px-4 py-6 text-center text-sm font-bold text-ink-soft">No photo yet</p>
	{/if}

	<div>
		<label class="label" for="file-{id}">{image ? 'Replace photo' : 'Upload photo'}</label>
		<input id="file-{id}" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="input !p-2" />
	</div>
	<div>
		<label class="label" for="alt-{id}">{altLabel}</label>
		<input id="alt-{id}" name="alt" class="input" maxlength="200" value={image?.alt ?? ''} placeholder={altPlaceholder} />
	</div>

	<div class="flex flex-wrap gap-2">
		<button class="btn btn-pink !py-1.5" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
		{#if image}
			<button
				formaction="?/clearSingle"
				class="btn btn-danger !py-1.5"
				disabled={busy}
				onclick={(e) => {
					if (!confirm('Remove this photo?')) e.preventDefault();
				}}
			>
				Remove
			</button>
		{/if}
	</div>
</form>
