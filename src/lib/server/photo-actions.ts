import { fail, type Actions } from '@sveltejs/kit';
import { sql } from './db';
import { removeFile, saveUpload } from './images';

/** Single-photo slots: which (kind, slot) pairs exist, and how wide each is stored. */
const ALLOWED: Record<string, number[]> = { menu: [1, 2, 3], about: [0], partner: [0] };
const WIDTH: Record<string, number> = { menu: 1000, about: 1200, partner: 1000, banner: 2000 };

export { WIDTH };

type Existing = { id: number; filename: string };

/** Form actions shared by the Photos page and the Joe's Dough page. */
export const photoActions: Actions = {
	setSingle: async ({ request }) => {
		const f = await request.formData();
		const kind = String(f.get('kind') ?? '');
		const slot = Number(f.get('slot'));
		if (!ALLOWED[kind]?.includes(slot)) return fail(400, { error: 'Unknown photo slot.' });

		const alt = String(f.get('alt') ?? '').trim().slice(0, 200);
		const file = f.get('file');
		const [existing] = await sql<Existing[]>`
			select id, filename from images where kind = ${kind} and slot = ${slot}`;

		if (file instanceof File && file.size > 0) {
			let filename: string;
			try {
				filename = await saveUpload(file, WIDTH[kind]);
			} catch (err) {
				return fail(400, { error: err instanceof Error ? err.message : 'Upload failed.' });
			}
			if (existing) {
				await sql`update images set filename = ${filename}, alt = ${alt} where id = ${existing.id}`;
				await removeFile(existing.filename);
			} else {
				await sql`insert into images (kind, slot, filename, alt) values (${kind}, ${slot}, ${filename}, ${alt})`;
			}
			return { message: 'Photo saved.' };
		}

		if (existing) {
			await sql`update images set alt = ${alt} where id = ${existing.id}`;
			return { message: 'Caption saved.' };
		}
		return fail(400, { error: 'Choose a photo to upload first.' });
	},

	clearSingle: async ({ request }) => {
		const f = await request.formData();
		const kind = String(f.get('kind') ?? '');
		const slot = Number(f.get('slot'));
		if (!ALLOWED[kind]?.includes(slot)) return fail(400, { error: 'Unknown photo slot.' });

		const rows = await sql<Existing[]>`
			delete from images where kind = ${kind} and slot = ${slot} returning id, filename`;
		for (const row of rows) await removeFile(row.filename);
		return { message: 'Photo removed.' };
	}
};
