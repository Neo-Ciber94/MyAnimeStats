export const capitalize = (s: string) => {
	return s.charAt(0).toUpperCase() + s.slice(1);
};

export function hash(s: string): number {
	let hash = 5381;
	for (let i = 0; i < s.length; i++) {
		hash = (hash * 33) ^ s.charCodeAt(i);
	}
	return hash >>> 0; // Ensure a positive 32-bit integer hash value
}

export function* numberRange(max: number) {
	for (let i = 0; i < max; i++) {
		yield i;
	}
}

export function identity<T>(value: T) {
	return value;
}

export function numberToColor(value: number): string {
	const red = (value & 0xff0000) >> 16;
	const green = (value & 0x00ff00) >> 8;
	const blue = value & 0x0000ff;

	const rr = red.toString(16).padStart(2, '0');
	const gg = green.toString(16).padStart(2, '0');
	const bb = blue.toString(16).padStart(2, '0');

	return `#${rr}${gg}${bb}`;
}

export function getArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [value];
}

export function swapArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
	const temp = array[fromIndex];
	array[fromIndex] = array[toIndex];
	array[toIndex] = temp;
	return array;
}

export function shuffleArray<T>(array: T[]): T[] {
	for (let i = 0; i < array.length; i++) {
		const randomIndex = Math.floor(Math.random() * array.length);
		swapArray(array, i, randomIndex);
	}

	return array;
}

export function parseNumberOrNull(s: string | null): number | null {
	if (s == null) {
		return null;
	}

	const value = Number(s);
	return Number.isNaN(value) ? null : value;
}
