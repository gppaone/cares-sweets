import type { Actions } from '@sveltejs/kit';
import { getHours } from '$lib/server/data';
import { sql } from '$lib/server/db';

export const load = async () => ({ hours: await getHours() });

export const actions: Actions = {
	default: async ({ request }) => {
		const f = await request.formData();
		for (let day = 0; day < 7; day++) {
			const hours = String(f.get(`hours_${day}`) ?? '').trim().slice(0, 60);
			const closed = f.get(`closed_${day}`) === 'on';
			await sql`
				insert into hours (day, hours, closed) values (${day}, ${hours}, ${closed})
				on conflict (day) do update set hours = excluded.hours, closed = excluded.closed`;
		}
		return { message: 'Hours saved.' };
	}
};
