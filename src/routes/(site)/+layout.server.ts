import { getHours, getSettings } from '$lib/server/data';

export const load = async () => {
	const [settings, hours] = await Promise.all([getSettings(), getHours()]);
	const now = new Date();
	return {
		settings,
		hours,
		today: now.getDay(),
		todayISO: now.toLocaleDateString('en-CA') // YYYY-MM-DD in the server's TZ
	};
};
