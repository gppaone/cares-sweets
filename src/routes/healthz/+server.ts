import { sql } from '$lib/server/db';

export const GET = async () => {
	await sql`select 1`;
	return new Response('ok');
};
