<script lang="ts">
	import { enhance } from '$app/forms';
	import Banner from '$lib/components/Banner.svelte';
	import Cow from '$lib/components/Cow.svelte';
	import MenuList from '$lib/components/MenuList.svelte';
	import { formatDate, mapsLink } from '$lib/format';
	import { DAYS, WEEK_ORDER } from '$lib/hours';

	let { data, form } = $props();
	let sending = $state(false);

	const regular = $derived(data.locations.filter((l) => l.kind === 'regular'));
	const events = $derived(data.locations.filter((l) => l.kind === 'event'));
	const todaysEvent = $derived(events.find((e) => e.event_date === data.todayISO));
	const stop = $derived(todaysEvent ?? regular[0]);
	const todayHours = $derived(data.hours.find((h) => h.day === data.today));
	const week = $derived(WEEK_ORDER.map((d) => data.hours.find((h) => h.day === d)!).filter(Boolean));
	const aboutParagraphs = $derived((data.settings.about_text ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean));

	// Photos
	const banners = $derived(data.images.filter((i) => i.kind === 'banner'));
	const menuPhotos = $derived(data.images.filter((i) => i.kind === 'menu').sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0)));
	const aboutPhoto = $derived(data.images.find((i) => i.kind === 'about'));
	const partnerPhoto = $derived(data.images.find((i) => i.kind === 'partner'));

	// Guest-baker section (Joe's Dough to Go)
	const partnerOn = $derived(data.settings.partner_enabled === 'true');
	const partnerName = $derived(data.settings.partner_name || "Joe's Dough to Go");
</script>

<svelte:head>
	<title>Care's Sweets &amp; Salty Treats | Homemade pastries, breads &amp; ice cream food truck</title>
	<meta
		name="description"
		content="Care's Sweets & Salty Treats is a food truck serving homemade pastries, breads, cider donuts, cookies, ice cream, milkshakes and salty snacks. See the menu and find the truck."
	/>
</svelte:head>

<!-- HERO -->
<section id="home" class="relative overflow-hidden bg-gradient-to-b from-powder via-sky/40 to-white">
	<div class="pointer-events-none absolute -left-20 top-8 size-72 rounded-full bg-blush/80 blur-2xl"></div>
	<div class="pointer-events-none absolute -right-24 top-40 size-80 rounded-full bg-lilac/60 blur-2xl"></div>
	<div class="pointer-events-none absolute bottom-0 left-1/3 size-56 rounded-full bg-bubblegum/40 blur-2xl"></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-14 pt-8 md:pt-14">
		<div class="grid grid-cols-2 items-end gap-x-2 gap-y-6 md:grid-cols-[1fr_auto_1fr]">
			<h1 class="col-span-2 text-center leading-none md:order-2 md:col-span-1">
				<span class="block font-display text-7xl font-black sm:text-8xl lg:text-9xl">Care's</span>
				<span class="-mt-1 block font-script text-4xl sm:text-5xl lg:text-6xl">Sweets &amp; Salty</span>
				<span class="block font-display text-4xl font-black sm:text-5xl lg:text-6xl">Treats</span>
			</h1>

			<Cow pose="standing" holding="cookies" class="mx-auto w-36 sm:w-44 md:order-1 md:w-60" />
			<Cow pose="sitting" holding="bowl" class="mx-auto w-36 sm:w-44 md:order-3 md:w-60" />
		</div>

		<div class="mx-auto mt-6 h-1 w-56 rounded-full bg-ink sm:w-96"></div>
		<p class="mx-auto mt-5 max-w-xl text-center text-lg font-bold sm:text-xl">
			Homemade pastries, fresh-baked breads &amp; creamy ice cream, served from our truck window.
		</p>

		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a href="#menu" class="btn btn-pink text-lg">See the menu</a>
			<a href="#locations" class="btn btn-ghost text-lg">Find the truck</a>
		</div>

		{#if stop}
			<div class="card mx-auto mt-10 max-w-xl text-center">
				<p class="font-script text-2xl text-ink-soft">
					{todaysEvent ? "Today's special stop" : 'Find us at'}
				</p>
				<p class="font-display text-3xl font-black leading-tight">{stop.name}</p>
				{#if stop.address}<p class="font-bold">{stop.address}</p>{/if}
				{#if todaysEvent?.time_text}
					<p class="font-bold">{todaysEvent.time_text}</p>
				{:else if todayHours}
					<p class="font-bold">
						Today: {todayHours.closed ? 'Closed' : todayHours.hours}
					</p>
				{/if}
				{#if stop.address}
					<a href={mapsLink(stop.address, stop.map_url)} target="_blank" rel="noopener" class="btn btn-blue mt-3 !py-1.5 text-sm">
						Get directions
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>

<!-- PHOTO BANNER (hidden until at least one slide is uploaded in the admin) -->
{#if banners.length}
	<Banner slides={banners} />
{/if}

<!-- MENU -->
<section id="menu" class="scroll-mt-20 bg-white px-4 py-14">
	<div class="mx-auto max-w-6xl">
		<div class="text-center">
			<p class="font-script text-3xl text-ink-soft">Fresh from the window</p>
			<h2 class="font-display text-5xl font-black sm:text-6xl">Our Menu</h2>
		</div>

		<div class="mt-12 grid gap-8 {menuPhotos.length ? 'lg:grid-cols-[17rem_1fr]' : 'mx-auto max-w-5xl'}">
			{#if menuPhotos.length}
				<div
					class="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-5 lg:[grid-template-rows:repeat(var(--n),minmax(0,1fr))]"
					style="--n: {menuPhotos.length}"
				>
					{#each menuPhotos as photo (photo.id)}
						<figure class="relative aspect-square overflow-hidden rounded-2xl border-4 border-ink shadow-[4px_4px_0_0_var(--color-bubblegum)] lg:aspect-auto">
							<img
								src="/uploads/{photo.filename}"
								alt={photo.alt ? '' : 'Menu photo'}
								class="absolute inset-0 size-full object-cover"
								loading="lazy"
								decoding="async"
							/>
							{#if photo.alt}
								<figcaption class="absolute inset-x-2 bottom-2 truncate rounded-full border-2 border-ink bg-white px-2 py-0.5 text-center text-xs font-extrabold sm:text-sm">
									{photo.alt}
								</figcaption>
							{/if}
						</figure>
					{/each}
				</div>
			{/if}

			<div class="relative mt-6 rounded-[2rem] border-4 border-ink bg-powder px-5 py-8 shadow-[8px_8px_0_0_var(--color-bubblegum)] sm:px-10 lg:mt-0">
				<Cow pose="head" class="absolute -top-9 left-4 w-20 -rotate-6 sm:left-8 sm:w-24" label="" />
				<Cow pose="head" flip class="absolute -top-9 right-4 w-20 rotate-6 sm:right-8 sm:w-24" label="" />

				<div class="pt-4">
					{#if data.menu.length === 0}
						<p class="py-10 text-center text-lg font-bold">The menu is being updated. Check back soon!</p>
					{:else}
						<MenuList items={data.menu} prefix="menu" />
					{/if}
				</div>

				<p class="mt-10 text-center font-script text-2xl">Baked with love, made from scratch</p>
			</div>
		</div>
	</div>
</section>

<!-- GUEST BAKER: JOE'S DOUGH TO GO (switched on/off in the admin) -->
{#if partnerOn}
	<section id="joes" class="scroll-mt-20 bg-sky/40 px-4 py-14">
		<div class="mx-auto max-w-5xl">
			<div class="text-center">
				<span class="inline-block rounded-full border-2 border-ink bg-lilac px-4 py-1 text-sm font-extrabold">Guest bakers</span>
				<p class="mt-3 font-script text-3xl text-ink-soft">Fresh-baked by our friends at</p>
				<h2 class="font-display text-5xl font-black sm:text-6xl">{partnerName}</h2>
				{#if data.settings.partner_note}
					<p class="mt-3 inline-block rounded-full border-2 border-ink bg-bubblegum px-4 py-1.5 font-extrabold">
						{data.settings.partner_note}
					</p>
				{/if}
				{#if data.settings.partner_blurb}
					<p class="mx-auto mt-4 max-w-2xl text-lg font-semibold">{data.settings.partner_blurb}</p>
				{/if}
			</div>

			{#if partnerPhoto || data.partnerItems.length}
				<div class="mt-10 grid gap-8 {partnerPhoto && data.partnerItems.length ? 'md:grid-cols-[18rem_1fr]' : ''}">
					{#if partnerPhoto}
						<figure class="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-ink shadow-[6px_6px_0_0_var(--color-lilac)] md:aspect-auto md:min-h-64 {data.partnerItems.length ? '' : 'mx-auto w-full max-w-xl'}">
							<img
								src="/uploads/{partnerPhoto.filename}"
								alt={partnerPhoto.alt}
								class="absolute inset-0 size-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</figure>
					{/if}
					{#if data.partnerItems.length}
						<div class="rounded-[2rem] border-4 border-ink bg-white px-5 py-8 shadow-[8px_8px_0_0_var(--color-lilac)] sm:px-10">
							<MenuList items={data.partnerItems} prefix="joes" />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- LOCATIONS -->
<section id="locations" class="scroll-mt-20 bg-blush/50 px-4 py-14">
	<div class="mx-auto max-w-6xl">
		<div class="text-center">
			<p class="font-script text-3xl text-ink-soft">Come say hi</p>
			<h2 class="font-display text-5xl font-black sm:text-6xl">Find the Truck</h2>
		</div>

		<div class="mt-10 grid gap-8 lg:grid-cols-3">
			<div class="space-y-8 lg:col-span-2">
				<div>
					<h3 class="mb-3 font-display text-3xl font-black">Our usual spot</h3>
					<div class="grid gap-4 sm:grid-cols-2">
						{#each regular as loc (loc.id)}
							<article class="card">
								<h4 class="font-display text-2xl font-black">{loc.name}</h4>
								{#if loc.address}<p class="font-bold">{loc.address}</p>{/if}
								{#if loc.time_text}<p class="font-bold">{loc.time_text}</p>{/if}
								{#if loc.notes}<p class="mt-1 text-ink-soft">{loc.notes}</p>{/if}
								{#if loc.address}
									<a href={mapsLink(loc.address, loc.map_url)} target="_blank" rel="noopener" class="btn btn-blue mt-3 !py-1.5 text-sm">Open in Maps</a>
								{/if}
							</article>
						{:else}
							<p class="card">Follow along for our next stop!</p>
						{/each}
					</div>
				</div>

				<div>
					<h3 class="mb-3 font-display text-3xl font-black">Upcoming events</h3>
					{#if events.length === 0}
						<p class="card">No special events on the calendar right now. See you at our usual spot!</p>
					{:else}
						<ul class="space-y-4">
							{#each events as ev (ev.id)}
								<li class="card flex flex-col gap-3 sm:flex-row sm:items-center">
									<div class="shrink-0 rounded-2xl border-2 border-ink bg-sky px-4 py-2 text-center font-display text-xl font-black">
										{ev.event_date ? formatDate(ev.event_date) : 'Coming soon'}
									</div>
									<div class="flex-1">
										<h4 class="font-display text-2xl font-black leading-tight">{ev.name}</h4>
										<p class="font-bold">
											{ev.address}{#if ev.address && ev.time_text}<span aria-hidden="true"> · </span>{/if}{ev.time_text}
										</p>
										{#if ev.notes}<p class="text-ink-soft">{ev.notes}</p>{/if}
									</div>
									{#if ev.address}
										<a href={mapsLink(ev.address, ev.map_url)} target="_blank" rel="noopener" class="btn btn-ghost !py-1.5 text-sm">Directions</a>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>

			<aside class="card h-fit">
				<h3 class="font-display text-3xl font-black">Hours</h3>
				<table class="mt-2 w-full text-left">
					<tbody>
						{#each week as row (row.day)}
							<tr class="border-b border-ink/10 last:border-0 {row.day === data.today ? 'bg-sky/50 font-extrabold' : 'font-bold'}">
								<th scope="row" class="rounded-l-lg px-2 py-2">{DAYS[row.day]}</th>
								<td class="rounded-r-lg px-2 py-2 text-right">{row.closed ? 'Closed' : row.hours}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="mt-3 text-sm text-ink-soft">Hours can change for events and weather, so check back here before you head over.</p>
			</aside>
		</div>
	</div>
</section>

<!-- ABOUT -->
<section id="about" class="scroll-mt-20 bg-lilac/40 px-4 py-14">
	<div class="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[auto_1fr]">
		{#if aboutPhoto}
			<div class="relative mx-auto w-full max-w-xs md:w-72">
				<img
					src="/uploads/{aboutPhoto.filename}"
					alt={aboutPhoto.alt}
					class="aspect-[4/5] w-full rounded-3xl border-4 border-ink object-cover shadow-[6px_6px_0_0_var(--color-bubblegum)]"
					loading="lazy"
					decoding="async"
				/>
				<Cow pose="head" class="absolute -bottom-6 -right-4 w-20 rotate-6" label="" />
			</div>
		{:else}
			<Cow pose="standing" holding="cookies" class="mx-auto w-44 md:w-56" />
		{/if}
		<div>
			<p class="font-script text-3xl text-ink-soft">The story</p>
			<h2 class="font-display text-5xl font-black sm:text-6xl">About Us</h2>
			<div class="mt-4 space-y-4 text-lg font-semibold leading-relaxed">
				{#each aboutParagraphs as p}
					<p>{p}</p>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- CONTACT -->
<section id="contact" class="scroll-mt-20 bg-white px-4 py-14">
	<div class="mx-auto max-w-5xl">
		<div class="text-center">
			<p class="font-script text-3xl text-ink-soft">Questions, catering, or just hello</p>
			<h2 class="font-display text-5xl font-black sm:text-6xl">Contact Us</h2>
		</div>

		<div class="mt-10 grid gap-8 md:grid-cols-5">
			<div class="card bg-powder md:col-span-2" style="box-shadow: 4px 4px 0 0 var(--color-lilac)">
				<Cow pose="sitting" holding="bowl" class="mx-auto w-32" />
				<h3 class="mt-2 text-center font-display text-3xl font-black">We'd love to hear from you</h3>
				<ul class="mt-3 space-y-1 text-center font-bold">
					{#if data.settings.phone}<li>{data.settings.phone}</li>{/if}
					{#if data.settings.email}<li><a class="underline" href="mailto:{data.settings.email}">{data.settings.email}</a></li>{/if}
				</ul>
				<p class="mt-3 text-center text-sm font-semibold text-ink-soft">
					Planning a party or event? Tell us the date and how many guests.
				</p>
			</div>

			<form
				method="POST"
				action="?/contact"
				class="card space-y-4 md:col-span-3"
				use:enhance={() => {
					sending = true;
					return async ({ update }) => {
						await update();
						sending = false;
					};
				}}
			>
				{#if form?.success}
					<p role="status" class="rounded-xl border-2 border-emerald-700 bg-emerald-50 px-4 py-3 font-bold text-emerald-900">
						Thank you! Your message is on its way to the cows. We'll get back to you soon.
					</p>
				{/if}
				{#if form?.error}
					<p role="alert" class="rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">{form.error}</p>
				{/if}

				<!-- honeypot -->
				<div class="absolute -left-[9999px]" aria-hidden="true">
					<label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="label" for="c-name">Name</label>
						<input id="c-name" name="name" class="input" required maxlength="100" autocomplete="name" value={form?.values?.name ?? ''} />
					</div>
					<div>
						<label class="label" for="c-email">Email</label>
						<input id="c-email" name="email" type="email" class="input" required maxlength="200" autocomplete="email" value={form?.values?.email ?? ''} />
					</div>
				</div>
				<div>
					<label class="label" for="c-phone">Phone <span class="font-normal text-ink-soft">(optional)</span></label>
					<input id="c-phone" name="phone" type="tel" class="input" maxlength="40" autocomplete="tel" value={form?.values?.phone ?? ''} />
				</div>
				<div>
					<label class="label" for="c-message">Message</label>
					<textarea id="c-message" name="message" rows="5" class="input" required maxlength="3000">{form?.values?.message ?? ''}</textarea>
				</div>
				<button type="submit" class="btn btn-pink w-full text-lg sm:w-auto" disabled={sending}>
					{sending ? 'Sending...' : 'Send message'}
				</button>
			</form>
		</div>
	</div>
</section>
