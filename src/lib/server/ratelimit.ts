const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns true when `key` has gone over `max` attempts inside the window. In-memory only. */
export function limited(key: string, max: number, windowMs: number): boolean {
	const now = Date.now();

	if (hits.size > 1000) {
		for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
	}

	const entry = hits.get(key);
	if (!entry || entry.resetAt < now) {
		hits.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}
	entry.count += 1;
	return entry.count > max;
}
