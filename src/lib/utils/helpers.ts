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

export function numberToColor(value: number): string {
    const red = (value & 0xff0000) >> 16;
    const green = (value & 0x00ff00) >> 8;
    const blue = value & 0x0000ff;

    const rr = red.toString(16).padStart(2, '0');
    const gg = green.toString(16).padStart(2, '0')
    const bb = blue.toString(16).padStart(2, '0');

    return `#${rr}${gg}${bb}`;
}

export function getArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}