import { fail, type Actions } from '@sveltejs/kit';
import { getImages, getLocations, getMenu } from '$lib/server/data';
import { sql } from '$lib/server/db';
import { limited } from '$lib/server/ratelimit';

export const load = async () => {
	const [menu, partnerItems, locations, images] = await Promise.all([
		getMenu('main'),
		getMenu('joes'),
		getLocations(true),
		getImages(true)
	]);
	return { menu, partnerItems, locations, images };
};

const field = (f: FormData, key: string) => String(f.get(key) ?? '').trim();

export const actions: Actions = {
	contact: async ({ request, getClientAddress }) => {
		const f = await request.formData();

		// Honeypot: real visitors never see or fill this field.
		if (field(f, 'website')) return { success: true };

		const values = {
			name: field(f, 'name'),
			email: field(f, 'email'),
			phone: field(f, 'phone'),
			message: field(f, 'message')
		};

		if (limited(`contact:${getClientAddress()}`, 5, 60 * 60 * 1000)) {
			return fail(429, { error: 'Too many messages from this device. Please try again later.', values });
		}
		if (!values.name || values.name.length > 100) {
			return fail(400, { error: 'Please tell us your name.', values });
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 200) {
			return fail(400, { error: 'Please enter a valid email address.', values });
		}
		if (values.phone.length > 40) {
			return fail(400, { error: 'That phone number looks too long.', values });
		}
		if (!values.message || values.message.length > 3000) {
			return fail(400, { error: 'Please write a message (up to 3,000 characters).', values });
		}

		await sql`
			insert into messages (name, email, phone, body)
			values (${values.name}, ${values.email}, ${values.phone}, ${values.message})`;

		return { success: true };
	}
};
