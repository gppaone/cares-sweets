import type { Price } from './types';

/**
 * Admin editing format: one price per line.
 *   Small: $6
 *   Large: $8
 * A line with no colon is a single unlabeled price ("$3").
 */
export function parsePrices(text: string): Price[] {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const i = line.lastIndexOf(':');
			const label = i === -1 ? '' : line.slice(0, i).trim();
			let price = (i === -1 ? line : line.slice(i + 1)).trim();
			if (/^\d/.test(price)) price = `$${price}`;
			return { label, price };
		});
}

export function formatPrices(prices: Price[]): string {
	return prices.map((p) => (p.label ? `${p.label}: ${p.price}` : p.price)).join('\n');
}
