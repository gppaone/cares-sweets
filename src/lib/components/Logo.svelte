<script lang="ts">
	import Cow from './Cow.svelte';
	let { href = '/' }: { href?: string } = $props();
</script>

<a {href} class="flex items-center gap-2.5" aria-label="Care's Sweets & Salty Treats, home">
	<Cow pose="head" class="h-11 w-12 shrink-0" label="" />
	<span class="leading-none">
		<span class="block font-display text-2xl font-black">Care's</span>
		<span class="block font-script text-base text-ink-soft">Sweets &amp; Salty Treats</span>
	</span>
</a>
