import { sql } from '$lib/server/db';

export const load = async () => {
	const [{ unread }] = await sql<{ unread: number }[]>`
		select count(*)::int as unread from messages where not is_read`;
	return { unread };
};
