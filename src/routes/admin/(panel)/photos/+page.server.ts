import { fail, type Actions } from '@sveltejs/kit';
import { getImages } from '$lib/server/data';
import { sql } from '$lib/server/db';
import { removeFile, saveUpload } from '$lib/server/images';
import { WIDTH, photoActions } from '$lib/server/photo-actions';

export const load = async () => {
	const images = await getImages(false);
	return {
		banners: images.filter((i) => i.kind === 'banner'),
		singles: images.filter((i) => i.kind === 'menu' || i.kind === 'about')
	};
};

const text = (f: FormData, key: string, max: number) => String(f.get(key) ?? '').trim().slice(0, max);

export const actions: Actions = {
	...photoActions,

	addBanner: async ({ request }) => {
		const f = await request.formData();
		const file = f.get('file');
		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'Choose a photo for the banner.' });

		let filename: string;
		try {
			filename = await saveUpload(file, WIDTH.banner);
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : 'Upload failed.' });
		}

		const [{ max }] = await sql<{ max: number }[]>`
			select coalesce(max(sort), 0)::int as max from images where kind = 'banner'`;
		await sql`
			insert into images (kind, filename, alt, headline, subtext, sort)
			values ('banner', ${filename}, ${text(f, 'alt', 200)}, ${text(f, 'headline', 80)}, ${text(f, 'subtext', 160)}, ${max + 10})`;
		return { message: 'Banner slide added.' };
	},

	saveBanner: async ({ request }) => {
		const f = await request.formData();
		const id = Number(f.get('id'));
		if (!id) return fail(400, { error: 'Missing slide.' });
		await sql`
			update images set
				alt = ${text(f, 'alt', 200)},
				headline = ${text(f, 'headline', 80)},
				subtext = ${text(f, 'subtext', 160)},
				sort = ${Number(f.get('sort')) || 0},
				active = ${f.get('active') === 'on'}
			where id = ${id} and kind = 'banner'`;
		return { message: 'Slide saved.' };
	},

	removeBanner: async ({ request }) => {
		const id = Number((await request.formData()).get('id'));
		if (!id) return fail(400, { error: 'Missing slide.' });
		const rows = await sql<{ filename: string }[]>`
			delete from images where id = ${id} and kind = 'banner' returning filename`;
		for (const row of rows) await removeFile(row.filename);
		return { message: 'Slide removed.' };
	}
};
