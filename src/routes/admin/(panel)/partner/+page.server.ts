import { fail, type Actions } from '@sveltejs/kit';
import { getImages, getMenu, getSettings } from '$lib/server/data';
import { sql } from '$lib/server/db';
import { itemActions } from '$lib/server/item-actions';
import { photoActions } from '$lib/server/photo-actions';

export const load = async () => {
	const [settings, items, images] = await Promise.all([getSettings(), getMenu('joes'), getImages(false)]);
	return { settings, items, photo: images.find((i) => i.kind === 'partner') ?? null };
};

const text = (f: FormData, key: string, max: number) => String(f.get(key) ?? '').trim().slice(0, max);

async function setSetting(key: string, value: string) {
	await sql`
		insert into settings (key, value) values (${key}, ${value})
		on conflict (key) do update set value = excluded.value`;
}

export const actions: Actions = {
	...itemActions('joes'),
	...photoActions,

	info: async ({ request }) => {
		const f = await request.formData();
		const name = text(f, 'partner_name', 80);
		if (!name) return fail(400, { error: 'Give the section a name.' });

		const enabled = f.get('partner_enabled') === 'on';
		await setSetting('partner_enabled', enabled ? 'true' : 'false');
		await setSetting('partner_name', name);
		await setSetting('partner_blurb', text(f, 'partner_blurb', 1000));
		await setSetting('partner_note', text(f, 'partner_note', 200));
		return { message: enabled ? 'Saved. The section is showing on the site.' : 'Saved. The section is hidden.' };
	}
};
