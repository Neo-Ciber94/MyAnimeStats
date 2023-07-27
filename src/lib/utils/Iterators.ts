export function groupBy<T, K>(items: T[], keySelector: (item: T) => K): Map<K, T[]> {
    const groups = new Map();

    for (const item of items) {
        const key = keySelector(item);
        const grouping = groups.get(key) || [];
        grouping.push(item);
        groups.set(key, grouping);
    }

    return groups;
}