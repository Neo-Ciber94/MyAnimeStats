export function flattenObject(obj: Record<string, unknown>): Record<string, unknown> {
	function recurse(
		result: Record<string, unknown>,
		current: Record<string, unknown>,
		currentPath = ''
	) {
		for (const key in current) {
			const value = current[key];
			const newPath = currentPath ? `${currentPath}.${key}` : key;

			if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
				// If the current value is an object (but not an array or null), recursively flatten it.
				recurse(result, value as Record<string, unknown>, newPath);
			} else {
				// Otherwise, add the flattened key and value to the result object.
				result[newPath] = value;
			}
		}

		return result;
	}

	const result = recurse({}, obj);
	return result;
}
