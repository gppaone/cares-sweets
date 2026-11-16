/** "2026-11-21" -> "Sat, Nov 21" (built from parts so the time zone never shifts the day) */
export function formatDate(iso: string): string {
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, m - 1, d).toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
}

export function mapsLink(address: string, custom?: string | null): string {
	if (custom && /^https?:\/\//i.test(custom)) return custom;
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function safeUrl(url: string | undefined): string {
	return url && /^https?:\/\//i.test(url) ? url : '';
}
