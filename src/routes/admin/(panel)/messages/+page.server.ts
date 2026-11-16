import { fail, type Actions } from '@sveltejs/kit';
import { getMessages } from '$lib/server/data';
import { sql } from '$lib/server/db';

export const load = async () => ({ messages: await getMessages() });

export const actions: Actions = {
	toggle: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Missing message.' });
		await sql`update messages set is_read = not is_read where id = ${id}`;
		return {};
	},

	remove: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Missing message.' });
		await sql`delete from messages where id = ${id}`;
		return { message: 'Message deleted.' };
	}
};
