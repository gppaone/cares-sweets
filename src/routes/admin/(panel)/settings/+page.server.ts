import type { Actions } from '@sveltejs/kit';
import { getSettings } from '$lib/server/data';
import { sql } from '$lib/server/db';
import { SETTING_FIELDS } from '$lib/settings';

export const load = async () => ({ settings: await getSettings() });

export const actions: Actions = {
	default: async ({ request }) => {
		const f = await request.formData();
		for (const field of SETTING_FIELDS) {
			const value = String(f.get(field.key) ?? '').trim().slice(0, 5000);
			await sql`
				insert into settings (key, value) values (${field.key}, ${value})
				on conflict (key) do update set value = excluded.value`;
		}
		return { message: 'Site info saved.' };
	}
};
