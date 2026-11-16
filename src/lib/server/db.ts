import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import { DEFAULT_SETTINGS } from '$lib/settings';
import type { Price } from '$lib/types';

export const sql = postgres(
	env.DATABASE_URL ?? 'postgres://cares:cares@localhost:5432/cares',
	{ max: 10, onnotice: () => {} }
);

/** Wrap a value for a jsonb column. */
export const json = (value: unknown) => sql.json(value as never);

const SCHEMA = `
create table if not exists menu_items (
	id serial primary key,
	category text not null default 'Menu',
	name text not null,
	note text not null default '',
	prices jsonb not null default '[]'::jsonb,
	available boolean not null default true,
	sort int not null default 0
);
create table if not exists locations (
	id serial primary key,
	name text not null,
	kind text not null default 'event' check (kind in ('regular', 'event')),
	address text not null default '',
	notes text not null default '',
	event_date date,
	time_text text not null default '',
	map_url text not null default '',
	active boolean not null default true,
	sort int not null default 0
);
create table if not exists hours (
	day int primary key check (day between 0 and 6),
	hours text not null default '',
	closed boolean not null default false
);
create table if not exists settings (
	key text primary key,
	value text not null default ''
);
create table if not exists messages (
	id serial primary key,
	name text not null,
	email text not null,
	phone text not null default '',
	body text not null,
	created_at timestamptz not null default now(),
	is_read boolean not null default false
);
create table if not exists images (
	id serial primary key,
	kind text not null check (kind in ('banner', 'menu', 'about', 'partner')),
	slot int,
	filename text not null,
	alt text not null default '',
	headline text not null default '',
	subtext text not null default '',
	sort int not null default 0,
	active boolean not null default true
);
create unique index if not exists images_single_idx on images (kind, slot) where slot is not null;
alter table menu_items add column if not exists section text not null default 'main';
`;

// Starting menu, copied from the printed menu board. Edit it in /admin.
const SEED_MENU: { category: string; name: string; note?: string; prices: Price[] }[] = [
	{ category: 'Sweet Bakes', name: 'Cider Donuts', prices: [{ label: 'Half Dozen', price: '$6.50' }, { label: 'Dozen', price: '$13' }] },
	{ category: 'Sweet Bakes', name: 'Cookies', prices: [{ label: '', price: '$3' }] },
	{ category: 'Cold & Creamy', name: 'Milkshakes', prices: [{ label: 'Small', price: '$6' }, { label: 'Large', price: '$8' }] },
	{ category: 'Cold & Creamy', name: 'Ice Cream', prices: [{ label: 'Small', price: '$3' }, { label: 'Large', price: '$5' }] },
	{ category: 'Cold & Creamy', name: 'Sundaes', note: 'Choose a cookie or a cider donut', prices: [{ label: '', price: '$7' }] },
	{ category: 'Salty Snacks', name: 'Pretzel Bites', prices: [{ label: 'Small', price: '$4' }, { label: 'Large', price: '$8' }] },
	{ category: 'Salty Snacks', name: 'Nachos & Cheese', prices: [{ label: '', price: '$5' }] },
	{ category: 'Drinks', name: 'Hot Coffee & Hot Chocolate', prices: [{ label: '', price: '$2.50' }] },
	{ category: 'Drinks', name: 'Water', prices: [{ label: '', price: '$2' }] },
	{ category: 'Drinks', name: 'Soda', prices: [{ label: '', price: '$1' }] }
];

// Placeholder hours so the page isn't empty on first launch. Edit in /admin.
const SEED_HOURS: Record<number, { hours: string; closed: boolean }> = {
	0: { hours: '11:00 AM – 6:00 PM', closed: false },
	1: { hours: '', closed: true },
	2: { hours: '', closed: true },
	3: { hours: '11:00 AM – 6:00 PM', closed: false },
	4: { hours: '11:00 AM – 6:00 PM', closed: false },
	5: { hours: '11:00 AM – 6:00 PM', closed: false },
	6: { hours: '11:00 AM – 6:00 PM', closed: false }
};

async function init() {
	// The database container may still be starting; retry for about a minute.
	for (let attempt = 0; ; attempt++) {
		try {
			await sql`select 1`;
			break;
		} catch (err) {
			if (attempt >= 30) throw err;
			await new Promise((r) => setTimeout(r, 2000));
		}
	}

	await sql.unsafe(SCHEMA);

	const [{ count: menuCount }] = await sql<{ count: number }[]>`select count(*)::int as count from menu_items where section = 'main'`;
	if (menuCount === 0) {
		let sort = 10;
		for (const item of SEED_MENU) {
			await sql`
				insert into menu_items (category, name, note, prices, sort)
				values (${item.category}, ${item.name}, ${item.note ?? ''}, ${json(item.prices)}, ${sort})`;
			sort += 10;
		}
	}

	const [{ count: locCount }] = await sql<{ count: number }[]>`select count(*)::int as count from locations`;
	if (locCount === 0) {
		await sql`
			insert into locations (name, kind, address, notes, time_text)
			values ('Our Usual Spot', 'regular', 'Add your street address in the admin panel',
			        'This is where you will find the truck most days.', '')`;
	}

	for (const [day, h] of Object.entries(SEED_HOURS)) {
		await sql`insert into hours (day, hours, closed) values (${Number(day)}, ${h.hours}, ${h.closed}) on conflict (day) do nothing`;
	}

	for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
		await sql`insert into settings (key, value) values (${key}, ${value}) on conflict (key) do nothing`;
	}
}

let ready: Promise<void> | null = null;

/** Creates tables and seeds starter data once per server start. */
export function ensureDb(): Promise<void> {
	return (ready ??= init().catch((err) => {
		ready = null;
		throw err;
	}));
}
