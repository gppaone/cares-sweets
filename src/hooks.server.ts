import { redirect, type Handle } from '@sveltejs/kit';
import { ensureDb } from '$lib/server/db';
import { COOKIE_NAME, verifySession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	await ensureDb();

	event.locals.admin = verifySession(event.cookies.get(COOKIE_NAME));

	const path = event.url.pathname;
	const isAdminArea = path === '/admin' || path.startsWith('/admin/');
	const isPublicAdminPath = path === '/admin/login';

	if (isAdminArea && !isPublicAdminPath && !event.locals.admin) {
		redirect(303, '/admin/login');
	}

	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	if (isAdminArea) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	return response;
};
