<!--
	The Care's cow mascot, drawn from the PNG artwork in /static/cows/.

	<Cow />                                         standing, holding cookies
	<Cow pose="sitting" holding="bowl" />           sitting, holding a bowl of treats
	<Cow pose="head" />                             just the face (logo / badges)
	<Cow flip class="w-40" />                       mirrored; size it with any width class

	To change or add artwork, edit the FILES table below. Any pose/holding
	combination that has no PNG falls back to the old drawn cow (CowDrawn.svelte).
-->
<script lang="ts">
	import CowDrawn from './CowDrawn.svelte';

	type Props = {
		pose?: 'standing' | 'sitting' | 'head';
		holding?: 'cookies' | 'bowl' | 'none';
		flip?: boolean;
		class?: string;
		label?: string;
	};

	let {
		pose = 'standing',
		holding = 'cookies',
		flip = false,
		class: className = '',
		label = 'Cartoon cow'
	}: Props = $props();

	// Put your PNG files in /static/cows/ with these names (or change the names here).
	const FILES: Record<string, string> = {
		'standing:cookies': '/cows/cow-standing.png',
		'sitting:bowl': '/cows/cow-sitting.png',
		head: '/cows/cow-head.png'
	};

	const src = $derived(pose === 'head' ? FILES.head : FILES[`${pose}:${holding}`]);
	let failed = $state(false);
</script>

{#if src && !failed}
	<img
		{src}
		alt={label}
		class="{className} object-contain"
		style:transform={flip ? 'scaleX(-1)' : undefined}
		decoding="async"
		onerror={() => (failed = true)}
	/>
{:else}
	<CowDrawn {pose} {holding} {flip} class={className} {label} />
{/if}