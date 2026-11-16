<script lang="ts">
	import { enhance } from '$app/forms';
	import FormMessage from '$lib/components/FormMessage.svelte';

	let { data, form } = $props();

	function confirmDelete(e: MouseEvent, name: string) {
		if (!confirm(`Delete "${name}"?`)) e.preventDefault();
	}
</script>

<h1 class="font-display text-4xl font-black">Locations</h1>
<p class="mb-4 text-ink-soft">
	"Usual spot" is where the truck is most days. "Event" is a one-time stop with a date; it disappears from the
	site automatically the day after.
</p>

<FormMessage {form} />

<form method="POST" action="?/add" use:enhance class="card mb-8 space-y-3">
	<h2 class="font-display text-2xl font-black">Add a location or event</h2>
	<div class="grid gap-3 sm:grid-cols-2">
		<div>
			<label class="label" for="new-name">Name</label>
			<input id="new-name" name="name" class="input" required placeholder="Fall Harvest Festival" />
		</div>
		<div>
			<label class="label" for="new-kind">Type</label>
			<select id="new-kind" name="kind" class="input">
				<option value="event">Event (one date)</option>
				<option value="regular">Usual spot</option>
			</select>
		</div>
		<div>
			<label class="label" for="new-date">Date (events only)</label>
			<input id="new-date" name="event_date" type="date" class="input" />
		</div>
		<div>
			<label class="label" for="new-time">Time</label>
			<input id="new-time" name="time_text" class="input" placeholder="11:00 AM – 4:00 PM" />
		</div>
	</div>
	<div>
		<label class="label" for="new-address">Address</label>
		<input id="new-address" name="address" class="input" placeholder="123 Main St, Town, ST" />
	</div>
	<div class="grid gap-3 sm:grid-cols-2">
		<div>
			<label class="label" for="new-notes">Notes</label>
			<input id="new-notes" name="notes" class="input" placeholder="Next to the pavilion" />
		</div>
		<div>
			<label class="label" for="new-map">Map link (optional)</label>
			<input id="new-map" name="map_url" class="input" placeholder="https://maps.google.com/..." />
		</div>
	</div>
	<label class="flex items-center gap-2 font-bold">
		<input type="checkbox" name="active" checked class="size-5 accent-bubblegum" /> Show on the site
	</label>
	<button class="btn btn-pink">Add</button>
</form>

<h2 class="mb-3 font-display text-2xl font-black">All locations</h2>
<div class="space-y-4">
	{#each data.locations as loc (loc.id)}
		<form method="POST" use:enhance class="card space-y-3">
			<input type="hidden" name="id" value={loc.id} />
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="label" for="name-{loc.id}">Name</label>
					<input id="name-{loc.id}" name="name" class="input" required value={loc.name} />
				</div>
				<div>
					<label class="label" for="kind-{loc.id}">Type</label>
					<select id="kind-{loc.id}" name="kind" class="input">
						<option value="event" selected={loc.kind === 'event'}>Event (one date)</option>
						<option value="regular" selected={loc.kind === 'regular'}>Usual spot</option>
					</select>
				</div>
				<div>
					<label class="label" for="date-{loc.id}">Date (events only)</label>
					<input id="date-{loc.id}" name="event_date" type="date" class="input" value={loc.event_date ?? ''} />
				</div>
				<div>
					<label class="label" for="time-{loc.id}">Time</label>
					<input id="time-{loc.id}" name="time_text" class="input" value={loc.time_text} />
				</div>
			</div>
			<div>
				<label class="label" for="addr-{loc.id}">Address</label>
				<input id="addr-{loc.id}" name="address" class="input" value={loc.address} />
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="label" for="notes-{loc.id}">Notes</label>
					<input id="notes-{loc.id}" name="notes" class="input" value={loc.notes} />
				</div>
				<div>
					<label class="label" for="map-{loc.id}">Map link (optional)</label>
					<input id="map-{loc.id}" name="map_url" class="input" value={loc.map_url} />
				</div>
			</div>
			<div class="flex flex-wrap items-center gap-4">
				<label class="flex items-center gap-2 font-bold">
					<input type="checkbox" name="active" checked={loc.active} class="size-5 accent-bubblegum" /> Show on the site
				</label>
				<div class="flex items-center gap-2">
					<label class="label !mb-0" for="sort-{loc.id}">Order</label>
					<input id="sort-{loc.id}" name="sort" type="number" class="input !w-24" value={loc.sort} />
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				<button formaction="?/save" class="btn btn-pink !py-1.5">Save</button>
				<button formaction="?/remove" class="btn btn-danger !py-1.5" onclick={(e) => confirmDelete(e, loc.name)}>Delete</button>
			</div>
		</form>
	{/each}
</div>
