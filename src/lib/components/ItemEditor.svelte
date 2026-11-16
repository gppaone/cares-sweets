<!--
	Admin editor for a list of menu items (used for the main menu and for Joe's Dough).
	The page that uses it must export add / save / remove actions (see lib/server/item-actions.ts).
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrices } from '$lib/prices';
	import type { MenuItem } from '$lib/types';

	let {
		items,
		listId,
		namePlaceholder = 'Sourdough Loaf',
		categoryPlaceholder = 'Fresh Breads'
	}: { items: MenuItem[]; listId: string; namePlaceholder?: string; categoryPlaceholder?: string } = $props();

	const categories = $derived([...new Set(items.map((i) => i.category))]);

	function confirmDelete(e: MouseEvent, name: string) {
		if (!confirm(`Delete "${name}"?`)) e.preventDefault();
	}
</script>

<datalist id={listId}>
	{#each categories as c}<option value={c}></option>{/each}
</datalist>

<form method="POST" action="?/add" use:enhance class="card mb-8 space-y-3">
	<h2 class="font-display text-2xl font-black">Add an item</h2>
	<div class="grid gap-3 sm:grid-cols-2">
		<div>
			<label class="label" for="{listId}-new-name">Name</label>
			<input id="{listId}-new-name" name="name" class="input" required placeholder={namePlaceholder} />
		</div>
		<div>
			<label class="label" for="{listId}-new-category">Category</label>
			<input id="{listId}-new-category" name="category" class="input" list={listId} placeholder={categoryPlaceholder} />
		</div>
	</div>
	<div class="grid gap-3 sm:grid-cols-2">
		<div>
			<label class="label" for="{listId}-new-prices">Prices (one per line)</label>
			<textarea id="{listId}-new-prices" name="prices" rows="3" class="input" placeholder={'Small: $6\nLarge: $8'}></textarea>
			<p class="mt-1 text-xs text-ink-soft">Use "Label: $price", or just "$3" for a single price.</p>
		</div>
		<div>
			<label class="label" for="{listId}-new-note">Short note (optional)</label>
			<input id="{listId}-new-note" name="note" class="input" placeholder="Baked fresh every morning" />
		</div>
	</div>
	<button class="btn btn-pink">Add item</button>
</form>

<h2 class="mb-3 font-display text-2xl font-black">Current items</h2>
<div class="space-y-4">
	{#each items as item (item.id)}
		<form method="POST" use:enhance class="card space-y-3">
			<input type="hidden" name="id" value={item.id} />
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="label" for="{listId}-name-{item.id}">Name</label>
					<input id="{listId}-name-{item.id}" name="name" class="input" required value={item.name} />
				</div>
				<div>
					<label class="label" for="{listId}-cat-{item.id}">Category</label>
					<input id="{listId}-cat-{item.id}" name="category" class="input" list={listId} value={item.category} />
				</div>
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="label" for="{listId}-prices-{item.id}">Prices (one per line)</label>
					<textarea id="{listId}-prices-{item.id}" name="prices" rows={Math.max(2, item.prices.length)} class="input">{formatPrices(item.prices)}</textarea>
				</div>
				<div class="space-y-3">
					<div>
						<label class="label" for="{listId}-note-{item.id}">Note</label>
						<input id="{listId}-note-{item.id}" name="note" class="input" value={item.note} />
					</div>
					<div class="flex items-center gap-4">
						<div class="w-24">
							<label class="label" for="{listId}-sort-{item.id}">Order</label>
							<input id="{listId}-sort-{item.id}" name="sort" type="number" class="input" value={item.sort} />
						</div>
						<label class="mt-5 flex items-center gap-2 font-bold">
							<input type="checkbox" name="available" checked={item.available} class="size-5 accent-bubblegum" />
							Available
						</label>
					</div>
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				<button formaction="?/save" class="btn btn-pink !py-1.5">Save</button>
				<button formaction="?/remove" class="btn btn-danger !py-1.5" onclick={(e) => confirmDelete(e, item.name)}>Delete</button>
			</div>
		</form>
	{:else}
		<p class="card">Nothing here yet. Add your first item above.</p>
	{/each}
</div>
