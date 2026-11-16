import { fail, type Actions } from '@sveltejs/kit';
import { getLocations } from '$lib/server/data';
import { sql } from '$lib/server/db';

export const load = async () => ({ locations: await getLocations(false) });

const text = (f: FormData, key: string) => String(f.get(key) ?? '').trim();

function read(f: FormData) {
	const kind = text(f, 'kind') === 'regular' ? 'regular' : 'event';
	const date = text(f, 'event_date');
	const mapUrl = text(f, 'map_url');
	return {
		name: text(f, 'name'),
		kind,
		address: text(f, 'address'),
		notes: text(f, 'notes'),
		event_date: kind === 'event' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
		time_text: text(f, 'time_text'),
		map_url: /^https?:\/\//i.test(mapUrl) ? mapUrl : '',
		active: f.get('active') === 'on',
		sort: Number(f.get('sort')) || 0
	};
}

export const actions: Actions = {
	add: async ({ request }) => {
		const v = read(await request.formData());
		if (!v.name) return fail(400, { error: 'Give the location a name.' });
		await sql`
			insert into locations (name, kind, address, notes, event_date, time_text, map_url, active, sort)
			values (${v.name}, ${v.kind}, ${v.address}, ${v.notes}, ${v.event_date}, ${v.time_text}, ${v.map_url}, ${v.active}, ${v.sort})`;
		return { message: `Added "${v.name}".` };
	},

	save: async ({ request }) => {
		const f = await request.formData();
		const id = Number(f.get('id'));
		const v = read(f);
		if (!id || !v.name) return fail(400, { error: 'Name is required.' });
		await sql`
			update locations set
				name = ${v.name}, kind = ${v.kind}, address = ${v.address}, notes = ${v.notes},
				event_date = ${v.event_date}, time_text = ${v.time_text}, map_url = ${v.map_url},
				active = ${v.active}, sort = ${v.sort}
			where id = ${id}`;
		return { message: `Saved "${v.name}".` };
	},

	remove: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Missing location.' });
		await sql`delete from locations where id = ${id}`;
		return { message: 'Location deleted.' };
	}
};
