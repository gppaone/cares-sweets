<!--
	Rotating photo banner with optional overlay text.
	Auto-advances every 6 seconds, pauses on hover/focus, and doesn't auto-advance
	for people who prefer reduced motion. Has previous/next buttons and dots.
-->
<script lang="ts">
	import type { SiteImage } from '$lib/types';

	let { slides }: { slides: SiteImage[] } = $props();

	let index = $state(0);
	let paused = $state(false);

	const go = (i: number) => {
		index = (i + slides.length) % slides.length;
	};

	$effect(() => {
		// Reads `index` so any change (auto or manual) restarts the timer.
		const current = index;
		if (slides.length < 2 || paused) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const timer = setTimeout(() => go(current + 1), 6000);
		return () => clearTimeout(timer);
	});
</script>

<section
	class="relative border-y-4 border-ink bg-powder"
	aria-roledescription="carousel"
	aria-label="Photos from the truck"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
	onfocusout={() => (paused = false)}
>
	<div class="relative mx-auto aspect-[4/3] max-h-[34rem] w-full overflow-hidden sm:aspect-[16/7]">
		{#each slides as slide, i (slide.id)}
			<div
				class="absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none {i === index ? 'opacity-100' : 'opacity-0'}"
				role="group"
				aria-roledescription="slide"
				aria-label="{i + 1} of {slides.length}"
				aria-hidden={i !== index}
			>
				<img
					src="/uploads/{slide.filename}"
					alt={slide.alt}
					class="size-full object-cover"
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
				{#if slide.headline || slide.subtext}
					<div class="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xl">
						<div class="rounded-2xl border-2 border-ink bg-white/90 px-5 py-3 shadow-[4px_4px_0_0_var(--color-bubblegum)] backdrop-blur">
							{#if slide.headline}
								<p class="font-display text-3xl font-black leading-tight sm:text-4xl">{slide.headline}</p>
							{/if}
							{#if slide.subtext}
								<p class="font-bold text-ink-soft">{slide.subtext}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if slides.length > 1}
		<button
			type="button"
			class="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-white/90 hover:bg-blush"
			onclick={() => go(index - 1)}
			aria-label="Previous photo"
		>
			<svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
		</button>
		<button
			type="button"
			class="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-white/90 hover:bg-blush"
			onclick={() => go(index + 1)}
			aria-label="Next photo"
		>
			<svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7" /></svg>
		</button>

		<div class="absolute right-4 top-4 flex gap-2 rounded-full border-2 border-ink bg-white/90 px-3 py-2">
			{#each slides as slide, i (slide.id)}
				<button
					type="button"
					class="size-3 rounded-full border-2 border-ink {i === index ? 'bg-ink' : 'bg-white'}"
					aria-label="Show photo {i + 1}"
					aria-current={i === index}
					onclick={() => go(i)}
				></button>
			{/each}
		</div>
	{/if}
</section>
