<!--
	Reusable cartoon cow (the Care's mascot).

	<Cow />                                         standing, holding cookies
	<Cow pose="sitting" holding="bowl" />           sitting, holding a bowl of treats
	<Cow pose="head" />                             just the face (logo / favicon / badges)
	<Cow flip class="w-40" />                       mirrored; size it with any width class

	Matching standalone files live in /static/cows/*.svg.
-->
<script lang="ts">
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

	// Unique prefix so several cows on one page don't share clipPath ids.
	const uid = $props.id();

	const ink = '#2b1f24';
	const pink = '#ffafcc';
	const blush = '#ffc8dd';

	const sit = $derived(pose === 'sitting');
	const viewBox = $derived(pose === 'head' ? '24 12 152 128' : '0 0 200 240');
	const tailY = $derived(sit ? 176 : 160);
	const bodyRx = $derived(sit ? 56 : 52);

	const bowlTreats = [
		[82, 166],
		[100, 160],
		[118, 166],
		[91, 171],
		[109, 171]
	];

	// Chocolate-chip offsets relative to a cookie's centre (as a fraction of its radius)
	const chipOffsets = [
		[-0.35, -0.3],
		[0.4, -0.1],
		[-0.1, 0.4],
		[0.15, -0.55]
	];
	const cookies = [
		{ x: 100, y: 165, r: 12 },
		{ x: 81, y: 173, r: 11 },
		{ x: 119, y: 173, r: 11 }
	];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{viewBox}
	class={className}
	style:transform={flip ? 'scaleX(-1)' : undefined}
	stroke-linecap="round"
	stroke-linejoin="round"
	role="img"
	aria-label={label}
>
	<defs>
		<clipPath id="{uid}-face"><ellipse cx="100" cy="78" rx="46" ry="40" /></clipPath>
		<clipPath id="{uid}-body"><ellipse cx="100" cy="160" rx={bodyRx} ry="46" /></clipPath>
	</defs>

	{#if pose !== 'head'}
		<!-- tail -->
		<path
			d="M{sit ? 154 : 150} {tailY} C178 {tailY - 2} 186 {tailY - 20} 178 {tailY - 38}"
			fill="none"
			stroke={ink}
			stroke-width="4"
		/>
		<ellipse cx="178" cy={tailY - 41} rx="6" ry="9" fill={ink} />

		<!-- standing legs -->
		{#if !sit}
			{#each [68, 108] as x}
				<rect {x} y="192" width="24" height="36" rx="11" fill="#fff" stroke={ink} stroke-width="3" />
				<rect {x} y="217" width="24" height="11" rx="5.5" fill={ink} />
			{/each}
		{/if}

		<!-- body + spots -->
		<ellipse cx="100" cy="160" rx={bodyRx} ry="46" fill="#fff" />
		<g clip-path="url(#{uid}-body)">
			<path d="M124 126 C156 122 164 160 144 172 C128 178 112 148 124 126Z" fill={ink} />
			<path d="M42 172 C52 150 80 158 78 186 C72 206 40 200 42 172Z" fill={ink} />
		</g>
		<ellipse cx="100" cy="160" rx={bodyRx} ry="46" fill="none" stroke={ink} stroke-width="3" />

		<!-- sitting feet -->
		{#if sit}
			{#each [72, 128] as x}
				<ellipse cx={x} cy="212" rx="21" ry="14" fill="#fff" stroke={ink} stroke-width="3" />
				<ellipse cx={x} cy="219" rx="15" ry="6" fill={ink} />
			{/each}
		{/if}

		<!-- what the cow is holding -->
		{#if holding === 'cookies'}
			<ellipse cx="100" cy="182" rx="40" ry="10" fill="#fff" stroke={ink} stroke-width="3" />
			{#each cookies as c}
				<circle cx={c.x} cy={c.y} r={c.r} fill="#d9a35f" stroke={ink} stroke-width="2.5" />
				{#each chipOffsets as [dx, dy]}
					<circle cx={c.x + dx * c.r} cy={c.y + dy * c.r} r="1.9" fill={ink} />
				{/each}
			{/each}
			<ellipse cx="58" cy="180" rx="12" ry="9" fill="#fff" stroke={ink} stroke-width="3" />
			<ellipse cx="142" cy="180" rx="12" ry="9" fill="#fff" stroke={ink} stroke-width="3" />
		{:else if holding === 'bowl'}
			<ellipse cx="100" cy="172" rx="34" ry="7" fill="#b9733a" stroke={ink} stroke-width="3" />
			{#each bowlTreats as [x, y]}
				<circle cx={x} cy={y} r="9" fill="#e8b06a" stroke={ink} stroke-width="2.5" />
				<circle cx={x - 3} cy={y - 3} r="1.8" fill="#fff" opacity="0.7" />
			{/each}
			<path
				d="M66 172 Q100 184 134 172 Q134 200 100 200 Q66 200 66 172Z"
				fill="#c98a4b"
				stroke={ink}
				stroke-width="3"
			/>
			<ellipse cx="62" cy="182" rx="12" ry="9" fill="#fff" stroke={ink} stroke-width="3" />
			<ellipse cx="138" cy="182" rx="12" ry="9" fill="#fff" stroke={ink} stroke-width="3" />
		{/if}
	{/if}

	<!-- head -->
	<ellipse cx="54" cy="70" rx="20" ry="11" transform="rotate(-20 54 70)" fill={pink} stroke={ink} stroke-width="3" />
	<ellipse cx="146" cy="70" rx="20" ry="11" transform="rotate(20 146 70)" fill={pink} stroke={ink} stroke-width="3" />
	<path d="M80 44 Q70 22 88 26 Q93 36 91 46Z" fill="#fff1c9" stroke={ink} stroke-width="3" />
	<path d="M120 44 Q130 22 112 26 Q107 36 109 46Z" fill="#fff1c9" stroke={ink} stroke-width="3" />
	<ellipse cx="100" cy="78" rx="46" ry="40" fill="#fff" />
	<g clip-path="url(#{uid}-face)">
		<path d="M48 80 C44 44 86 38 94 62 C98 80 70 92 48 80Z" fill={ink} />
	</g>
	<ellipse cx="100" cy="78" rx="46" ry="40" fill="none" stroke={ink} stroke-width="3" />
	<path d="M91 41 Q100 24 109 41Z" fill={ink} />
	<circle cx="82" cy="76" r="9.5" fill="#fff" stroke={ink} stroke-width="2.5" />
	<circle cx="118" cy="76" r="9.5" fill="#fff" stroke={ink} stroke-width="2.5" />
	<circle cx="83" cy="77" r="5.2" fill={ink} />
	<circle cx="117" cy="77" r="5.2" fill={ink} />
	<circle cx="85" cy="74.5" r="1.9" fill="#fff" />
	<circle cx="119" cy="74.5" r="1.9" fill="#fff" />
	<circle cx="63" cy="95" r="6" fill={blush} opacity="0.9" />
	<circle cx="137" cy="95" r="6" fill={blush} opacity="0.9" />
	<ellipse cx="100" cy="97" rx="26" ry="17" fill={pink} stroke={ink} stroke-width="3" />
	<ellipse cx="91" cy="93" rx="3" ry="4.5" fill={ink} opacity="0.75" />
	<ellipse cx="109" cy="93" rx="3" ry="4.5" fill={ink} opacity="0.75" />
	<path d="M90 104 Q100 112 110 104" fill="none" stroke={ink} stroke-width="2.5" />
</svg>
