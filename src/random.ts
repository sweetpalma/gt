import { range, shuffle } from 'lodash';

/**
 * Generate unique permutations of a given length.
 * *Unique* means that the same value will never have the same index twice.
 * @example randomOrder(3) = [[2, 3, 1], [3, 1, 2], [1, 2, 3]]
 */
export const randomOrder = (n: number) => {
	const result = range(n).map(() => range(n));
	for (let i = 0; i < n; i++) {
		result[i].unshift(...result[i].splice(-i));
	}
	return shuffle(result);
};

/**
 * Generate unique tables using given keys and values.
 * *Unique* means that the same key will never have the same value twice.
 */
export const randomTable = (keys: Array<string>, values: Array<string>) => {
	const matrix = randomOrder(Math.max(keys.length, values.length));
	return matrix.map((order) => {
		const map = {} as Record<string, string>;
		order
			.slice(0, keys.length)
			.forEach((x, y) => (map[keys[y]] = values[x] ?? null));
		return map;
	});
};
