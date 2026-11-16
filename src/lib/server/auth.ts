import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const COOKIE_NAME = 'cares_admin';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const secret = () => env.SESSION_SECRET || env.ADMIN_PASSWORD || '';

const hmac = (payload: string) => createHmac('sha256', secret()).update(payload).digest('hex');

export function createSession(): string {
	const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
	return `${expires}.${hmac(expires)}`;
}

export function verifySession(token: string | undefined): boolean {
	if (!token || !secret()) return false;
	const [expires, sig] = token.split('.');
	if (!expires || !sig) return false;
	const expected = Buffer.from(hmac(expires));
	const given = Buffer.from(sig);
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
	return Number(expires) > Date.now();
}

/** Constant-time password check. Fails closed if ADMIN_PASSWORD is not set. */
export function checkPassword(candidate: string): boolean {
	const real = env.ADMIN_PASSWORD;
	if (!real) return false;
	const a = createHash('sha256').update(candidate).digest();
	const b = createHash('sha256').update(real).digest();
	return timingSafeEqual(a, b);
}

export const cookieOptions = () => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	// SvelteKit defaults to secure cookies, which browsers drop on plain http:// (LAN use).
	secure: env.COOKIE_SECURE === 'true',
	maxAge: MAX_AGE_SECONDS
});
