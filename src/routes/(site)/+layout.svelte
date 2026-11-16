<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import Cow from '$lib/components/Cow.svelte';
	import { safeUrl } from '$lib/format';

	let { children, data } = $props();
	let open = $state(false);

	const links = $derived([
		{ href: '/#menu', label: 'Menu' },
		...(data.settings.partner_enabled === 'true'
			? [{ href: '/#joes', label: data.settings.partner_name || "Joe's Dough" }]
			: []),
		{ href: '/#locations', label: 'Find Us' },
		{ href: '/#about', label: 'About' },
		{ href: '/#contact', label: 'Contact' }
	]);

	const facebook = $derived(safeUrl(data.settings.facebook));
	const instagram = $derived(safeUrl(data.settings.instagram));
</script>

{#if data.settings.announcement}
	<div class="bg-lilac px-4 py-2 text-center text-sm font-extrabold">
		{data.settings.announcement}
	</div>
{/if}

<header class="sticky top-0 z-40 border-b-4 border-bubblegum bg-white/90 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
		<Logo />

		<nav class="hidden items-center gap-1 md:flex" aria-label="Main">
			{#each links as link}
				<a href={link.href} class="rounded-full px-4 py-2 font-extrabold hover:bg-blush">{link.label}</a>
			{/each}
			<a href="/#menu" class="btn btn-pink ml-2 !py-1.5">Order at the window</a>
		</nav>

		<button
			type="button"
			class="rounded-xl border-2 border-ink p-2 md:hidden"
			aria-expanded={open}
			aria-controls="mobile-nav"
			onclick={() => (open = !open)}
		>
			<span class="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
			<svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
				{#if open}
					<path d="M6 6l12 12M18 6L6 18" />
				{:else}
					<path d="M4 7h16M4 12h16M4 17h16" />
				{/if}
			</svg>
		</button>
	</div>

	{#if open}
		<nav id="mobile-nav" class="border-t-2 border-blush bg-white px-4 pb-4 md:hidden" aria-label="Main">
			{#each links as link}
				<a
					href={link.href}
					onclick={() => (open = false)}
					class="block rounded-xl px-3 py-3 text-lg font-extrabold hover:bg-blush"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<main>
	{@render children()}
</main>

<footer class="border-t-4 border-ink bg-powder">
	<div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
		<div class="flex items-start gap-3">
			<Cow pose="head" class="h-16 w-[4.5rem] shrink-0" label="" />
			<div>
				<p class="font-display text-3xl font-black leading-none">Care's</p>
				<p class="font-script text-xl">Sweets &amp; Salty Treats</p>
				<p class="mt-2 text-sm text-ink-soft">Homemade pastries, breads &amp; ice cream.</p>
			</div>
		</div>

		<div>
			<h2 class="font-display text-2xl font-black">Quick links</h2>
			<ul class="mt-2 space-y-1 font-bold">
				{#each links as link}
					<li><a href={link.href} class="underline decoration-2 underline-offset-4 hover:decoration-bubblegum">{link.label}</a></li>
				{/each}
			</ul>
		</div>

		<div>
			<h2 class="font-display text-2xl font-black">Say hello</h2>
			<ul class="mt-2 space-y-1 font-bold">
				{#if data.settings.phone}<li>{data.settings.phone}</li>{/if}
				{#if data.settings.email}<li><a class="underline" href="mailto:{data.settings.email}">{data.settings.email}</a></li>{/if}
				{#if facebook}<li><a class="underline" href={facebook} rel="noopener">Facebook</a></li>{/if}
				{#if instagram}<li><a class="underline" href={instagram} rel="noopener">Instagram</a></li>{/if}
			</ul>
		</div>
	</div>
	<div class="border-t-2 border-ink/20 bg-sky px-4 py-3 text-center text-sm font-bold">
		&copy; {new Date().getFullYear()} Care's Sweets &amp; Salty Treats
		<span class="mx-2" aria-hidden="true">·</span>
		<a href="/admin" class="underline">Staff login</a>
	</div>
</footer>
