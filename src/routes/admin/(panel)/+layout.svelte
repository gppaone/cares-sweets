<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';

	let { children, data } = $props();

	const tabs = [
		{ href: '/admin/menu', label: 'Menu' },
		{ href: '/admin/photos', label: 'Photos' },
		{ href: '/admin/partner', label: "Joe's Dough" },
		{ href: '/admin/locations', label: 'Locations' },
		{ href: '/admin/hours', label: 'Hours' },
		{ href: '/admin/settings', label: 'Site info' },
		{ href: '/admin/messages', label: 'Messages' }
	];
</script>

<svelte:head>
	<title>Admin | Care's</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-powder/70 to-white">
	<header class="border-b-4 border-bubblegum bg-white">
		<div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
			<Logo href="/admin/menu" />
			<div class="flex items-center gap-2">
				<a href="/" target="_blank" rel="noopener" class="btn btn-blue !py-1.5 text-sm">View site</a>
				<form method="POST" action="/admin/logout">
					<button class="btn btn-ghost !py-1.5 text-sm">Log out</button>
				</form>
			</div>
		</div>
		<nav class="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2" aria-label="Admin sections">
			{#each tabs as tab}
				{@const active = page.url.pathname.startsWith(tab.href)}
				<a
					href={tab.href}
					aria-current={active ? 'page' : undefined}
					class="whitespace-nowrap rounded-full px-4 py-2 font-extrabold {active ? 'bg-bubblegum' : 'hover:bg-blush'}"
				>
					{tab.label}
					{#if tab.href === '/admin/messages' && data.unread > 0}
						<span class="ml-1 rounded-full bg-ink px-2 py-0.5 text-xs text-white">{data.unread}</span>
					{/if}
				</a>
			{/each}
		</nav>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		{@render children()}
	</main>
</div>
