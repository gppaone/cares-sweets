<!-- Public menu: items grouped by category, name on the left, prices on the right. -->
<script lang="ts">
	import type { MenuItem } from '$lib/types';

	let { items, prefix = 'menu' }: { items: MenuItem[]; prefix?: string } = $props();

	const groups = $derived.by(() => {
		const map = new Map<string, MenuItem[]>();
		for (const item of items) {
			const key = item.category || 'Menu';
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(item);
		}
		return [...map.entries()];
	});
</script>

{#if groups.length === 0}
	<p class="py-10 text-center text-lg font-bold">Coming soon. Check back!</p>
{/if}

<div class="grid gap-x-12 gap-y-9 md:grid-cols-2">
	{#each groups as [category, list], gi}
		<section aria-labelledby="{prefix}-cat-{gi}">
			<h3 id="{prefix}-cat-{gi}" class="mb-3 border-b-4 border-ink pb-1 font-script text-3xl">{category}</h3>
			<ul class="space-y-4">
				{#each list as item (item.id)}
					<li class={item.available ? '' : 'opacity-60'}>
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span class="font-display text-2xl font-black leading-tight sm:text-3xl {item.available ? '' : 'line-through'}">
								{item.name}
							</span>
							<span class="mb-1 hidden min-w-4 flex-1 self-end border-b-2 border-dotted border-ink/40 sm:block"></span>
							<span class="flex flex-wrap gap-x-3 font-extrabold">
								{#each item.prices as p}
									<span>{#if p.label}<span class="font-bold">{p.label}</span> {/if} {p.price}</span>
								{/each}
							</span>
						</div>
						{#if item.note}<p class="text-sm font-bold text-ink-soft">{item.note}</p>{/if}
						{#if !item.available}
							<p class="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-extrabold">Sold out today</p>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
