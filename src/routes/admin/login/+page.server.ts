import { fail, redirect, type Actions } from '@sveltejs/kit';
import { COOKIE_NAME, checkPassword, cookieOptions, createSession } from '$lib/server/auth';
import { limited } from '$lib/server/ratelimit';

export const load = ({ locals }) => {
	if (locals.admin) redirect(303, '/admin/menu');
};

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		if (limited(`login:${getClientAddress()}`, 10, 10 * 60 * 1000)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		const f = await request.formData();
		const password = String(f.get('password') ?? '');

		if (!checkPassword(password)) {
			return fail(401, { error: 'That password is not right.' });
		}

		cookies.set(COOKIE_NAME, createSession(), cookieOptions());
		redirect(303, '/admin/menu');
	}
};
