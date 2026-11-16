<script lang="ts">
	import FormMessage from '$lib/components/FormMessage.svelte';
	import ItemEditor from '$lib/components/ItemEditor.svelte';

	let { data, form } = $props();
</script>

<h1 class="font-display text-4xl font-black">Menu</h1>
<p class="mb-4 text-ink-soft">Changes show on the public site as soon as you save. Menu photos are on the Photos tab.</p>

<FormMessage {form} />

<ItemEditor items={data.items} listId="main-categories" namePlaceholder="Apple Cider Donut" categoryPlaceholder="Sweet Bakes" />
