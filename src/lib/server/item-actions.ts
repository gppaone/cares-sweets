import { fail, type Actions } from '@sveltejs/kit';
import { json, sql } from './db';
import { parsePrices } from '$lib/prices';

const text = (f: FormData, key: string) => String(f.get(key) ?? '').trim();

/** add / save / remove actions for menu items in one section ("main" menu or "joes"). */
export function itemActions(section: 'main' | 'joes'): Actions {
	return {
		add: async ({ request }) => {
			const f = await request.formData();
			const name = text(f, 'name');
			if (!name) return fail(400, { error: 'Give the item a name.' });

			const [{ max }] = await sql<{ max: number }[]>`
				select coalesce(max(sort), 0)::int as max from menu_items where section = ${section}`;
			await sql`
				insert into menu_items (section, category, name, note, prices, available, sort)
				values (${section}, ${text(f, 'category') || 'Menu'}, ${name}, ${text(f, 'note')},
				        ${json(parsePrices(text(f, 'prices')))}, true, ${max + 10})`;
			return { message: `Added "${name}".` };
		},

		save: async ({ request }) => {
			const f = await request.formData();
			const id = Number(f.get('id'));
			const name = text(f, 'name');
			if (!id || !name) return fail(400, { error: 'Name is required.' });

			await sql`
				update menu_items set
					category = ${text(f, 'category') || 'Menu'},
					name = ${name},
					note = ${text(f, 'note')},
					prices = ${json(parsePrices(text(f, 'prices')))},
					available = ${f.get('available') === 'on'},
					sort = ${Number(f.get('sort')) || 0}
				where id = ${id} and section = ${section}`;
			return { message: `Saved "${name}".` };
		},

		remove: async ({ request }) => {
			const id = Number((await request.formData()).get('id'));
			if (!id) return fail(400, { error: 'Missing item.' });
			await sql`delete from menu_items where id = ${id} and section = ${section}`;
			return { message: 'Item deleted.' };
		}
	};
}
