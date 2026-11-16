import { getMenu } from '$lib/server/data';
import { itemActions } from '$lib/server/item-actions';

export const load = async () => ({ items: await getMenu('main') });

export const actions = itemActions('main');
