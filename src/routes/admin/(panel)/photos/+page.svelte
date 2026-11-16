<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';
	import PhotoSlot from '$lib/components/PhotoSlot.svelte';

	let { data, form } = $props();
	let adding = $state(false);

	const menuSlots = [
		{ slot: 1, label: 'Menu photo 1 (top)', placeholder: 'Cider Donuts' },
		{ slot: 2, label: 'Menu photo 2 (middle)', placeholder: 'Milkshakes' },
		{ slot: 3, label: 'Menu photo 3 (bottom)', placeholder: 'Cookies' }
	];

	const single = (kind: string, slot: number) => data.singles.find((i) => i.kind === kind && i.slot === slot);
</script>

<h1 class="font-display text-4xl font-black">Photos</h1>
<p class="mb-4 text-ink-soft">
	Upload straight from your phone or computer. Photos are automatically rotated, resized and optimized, so there's no need to shrink them first (15 MB max each).
</p>

<FormMessage {form} />

<!-- BANNER -->
<section class="mb-10">
	<h2 class="font-display text-3xl font-black">Banner slideshow</h2>
	<p class="mb-3 text-ink-soft">
		Shown right under the top of the home page. With more than one active slide it rotates automatically. Wide, bright photos of the truck or your treats work best. The text is optional.
	</p>

	<form
		method="POST"
		action="?/addBanner"
		enctype="multipart/form-data"
		class="card mb-6 space-y-3"
		use:enhance={() => {
			adding = true;
			return async ({ update }) => {
				await update();
				adding = false;
			};
		}}
	>
		<h3 class="font-display text-2xl font-black">Add a slide</h3>
		<div>
			<label class="label" for="b-file">Photo</label>
			<input id="b-file" name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="input !p-2" />
		</div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<label class="label" for="b-headline">Headline (optional)</label>
				<input id="b-headline" name="headline" class="input" maxlength="80" placeholder="Cider donuts are here!" />
			</div>
			<div>
				<label class="label" for="b-subtext">Smaller text (optional)</label>
				<input id="b-subtext" name="subtext" class="input" maxlength="160" placeholder="Warm, fresh, and made from scratch" />
			</div>
		</div>
		<div>
			<label class="label" for="b-alt">Describe the photo</label>
			<input id="b-alt" name="alt" class="input" maxlength="200" placeholder="The Care's food truck at the fall festival" />
			<p class="mt-1 text-xs text-ink-soft">Read aloud by screen readers; also helps if the photo can't load.</p>
		</div>
		<button class="btn btn-pink" disabled={adding}>{adding ? 'Uploading...' : 'Add slide'}</button>
	</form>

	<div class="space-y-4">
		{#each data.banners as slide (slide.id)}
			<form method="POST" use:enhance class="card space-y-3 {slide.active ? '' : 'opacity-70'}">
				<input type="hidden" name="id" value={slide.id} />
				<div class="flex flex-col gap-4 sm:flex-row">
					<img src="/uploads/{slide.filename}" alt={slide.alt} class="aspect-video w-full rounded-2xl border-2 border-ink object-cover sm:w-56" />
					<div class="flex-1 space-y-3">
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<label class="label" for="bh-{slide.id}">Headline</label>
								<input id="bh-{slide.id}" name="headline" class="input" maxlength="80" value={slide.headline} />
							</div>
							<div>
								<label class="label" for="bs-{slide.id}">Smaller text</label>
								<input id="bs-{slide.id}" name="subtext" class="input" maxlength="160" value={slide.subtext} />
							</div>
						</div>
						<div>
							<label class="label" for="ba-{slide.id}">Photo description</label>
							<input id="ba-{slide.id}" name="alt" class="input" maxlength="200" value={slide.alt} />
						</div>
						<div class="flex flex-wrap items-center gap-4">
							<label class="flex items-center gap-2 font-bold">
								<input type="checkbox" name="active" checked={slide.active} class="size-5 accent-bubblegum" /> Show on the site
							</label>
							<div class="flex items-center gap-2">
								<label class="label !mb-0" for="bo-{slide.id}">Order</label>
								<input id="bo-{slide.id}" name="sort" type="number" class="input !w-24" value={slide.sort} />
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					<button formaction="?/saveBanner" class="btn btn-pink !py-1.5">Save</button>
					<button
						formaction="?/removeBanner"
						class="btn btn-danger !py-1.5"
						onclick={(e) => {
							if (!confirm('Remove this slide and its photo?')) e.preventDefault();
						}}
					>
						Delete
					</button>
				</div>
			</form>
		{:else}
			<p class="card">No slides yet. Until you add one, the home page shows no banner.</p>
		{/each}
	</div>
</section>

<!-- MENU PHOTOS -->
<section class="mb-10">
	<h2 class="font-display text-3xl font-black">Menu photos</h2>
	<p class="mb-3 text-ink-soft">
		Three photos stacked beside the menu (above it on phones). The caption appears on the photo. Leave all three empty to hide this column.
	</p>
	<div class="grid gap-4 md:grid-cols-3">
		{#each menuSlots as s (s.slot)}
			<PhotoSlot image={single('menu', s.slot)} kind="menu" slot={s.slot} label={s.label} altLabel="Caption" altPlaceholder={s.placeholder} />
		{/each}
	</div>
</section>

<!-- ABOUT PHOTO -->
<section class="mb-10">
	<h2 class="font-display text-3xl font-black">About us photo</h2>
	<p class="mb-3 text-ink-soft">A photo of you or the truck, shown next to the About text. Without one, the cow is shown instead.</p>
	<div class="max-w-md">
		<PhotoSlot image={single('about', 0)} kind="about" slot={0} label="About photo" altLabel="Photo description" altPlaceholder="Care in front of the truck" />
	</div>
</section>
