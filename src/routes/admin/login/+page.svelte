<script lang="ts">
	import { enhance } from '$app/forms';
	import Cow from '$lib/components/Cow.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Staff login | Care's</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="grid min-h-screen place-items-center bg-gradient-to-b from-powder to-blush/60 px-4">
	<div class="card w-full max-w-sm text-center">
		<Cow pose="head" class="mx-auto w-28" label="" />
		<h1 class="mt-2 font-display text-4xl font-black">Staff login</h1>
		<p class="font-script text-xl text-ink-soft">Care's Sweets &amp; Salty Treats</p>

		<form method="POST" use:enhance class="mt-5 space-y-4 text-left">
			{#if form?.error}
				<p role="alert" class="rounded-xl border-2 border-red-700 bg-red-50 px-3 py-2 font-bold text-red-800">{form.error}</p>
			{/if}
			<div>
				<label for="password" class="label">Password</label>
				<input id="password" name="password" type="password" class="input" required autocomplete="current-password" />
			</div>
			<button class="btn btn-pink w-full">Log in</button>
		</form>
		<p class="mt-4 text-sm"><a href="/" class="underline">Back to the site</a></p>
	</div>
</div>
