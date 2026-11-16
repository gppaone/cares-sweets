export type Price = { label: string; price: string };

export interface MenuItem {
	id: number;
	category: string;
	name: string;
	note: string;
	prices: Price[];
	available: boolean;
	sort: number;
}

export interface SiteImage {
	id: number;
	kind: 'banner' | 'menu' | 'about' | 'partner';
	/** menu: 1-3 (top to bottom); about/partner: 0; banner: null */
	slot: number | null;
	filename: string;
	/** Alt text; for menu photos it is also shown as the caption */
	alt: string;
	/** Banner slides only: optional overlay text */
	headline: string;
	subtext: string;
	sort: number;
	active: boolean;
}

export interface Location {
	id: number;
	name: string;
	kind: 'regular' | 'event';
	address: string;
	notes: string;
	/** YYYY-MM-DD, or null for the regular spot */
	event_date: string | null;
	time_text: string;
	map_url: string;
	active: boolean;
	sort: number;
}

export interface HourRow {
	/** 0 = Sunday ... 6 = Saturday */
	day: number;
	hours: string;
	closed: boolean;
}

export interface Message {
	id: number;
	name: string;
	email: string;
	phone: string;
	body: string;
	created_at: Date;
	is_read: boolean;
}
