import { sql } from './db';
import type { HourRow, Location, MenuItem, Message, SiteImage } from '$lib/types';

export async function getSettings(): Promise<Record<string, string>> {
	const rows = await sql<{ key: string; value: string }[]>`select key, value from settings`;
	return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function getHours() {
	return sql<HourRow[]>`select day, hours, closed from hours order by day`;
}

export function getMenu(section: 'main' | 'joes' = 'main') {
	return sql<MenuItem[]>`
		select id, category, name, note, prices, available, sort
		from menu_items where section = ${section} order by sort, id`;
}

export function getImages(publicOnly = true) {
	return sql<SiteImage[]>`
		select id, kind, slot, filename, alt, headline, subtext, sort, active
		from images
		${publicOnly ? sql`where active` : sql``}
		order by kind, slot nulls last, sort, id`;
}

/** Public site: only active spots, and events that haven't passed. Admin: everything. */
export function getLocations(publicOnly = true) {
	return sql<Location[]>`
		select id, name, kind, address, notes, event_date::text as event_date,
		       time_text, map_url, active, sort
		from locations
		${publicOnly
			? sql`where active and (kind = 'regular' or event_date is null or event_date >= current_date)`
			: sql``}
		order by (kind = 'regular') desc, event_date nulls last, sort, id`;
}

export function getMessages() {
	return sql<Message[]>`
		select id, name, email, phone, body, created_at, is_read
		from messages order by created_at desc limit 200`;
}
