/**
 * Flattens a nested object or array into a single-level object.
 * @param obj The object or array to flatten.
 * @param separator The string to use between nested keys.
 * @returns A flattened object.
 */
export const flatten = (obj: Record<string, unknown>, separator = "-"): Record<string, unknown> => {
  const flattened: Record<string, unknown> = {};

  // The recursive function now accepts `unknown` for type safety.
  const recurse = (current: unknown, path: string) => {
    // This type guard is crucial. We must check if `current` is a
    // non-null object before trying to iterate over its entries.
    if (typeof current !== "object" || current === null) {
      return;
    }

    // After the check, TypeScript knows `current` is an object (or array),
    // so `Object.entries` can be used safely.
    for (const [key, value] of Object.entries(current)) {
      const newPath = path ? `${path}${separator}${key}` : key;

      // Recurse if the value is another non-null object.
      if (typeof value === "object" && value !== null) {
        recurse(value, newPath);
      } else {
        flattened[newPath] = value;
      }
    }
  };

  recurse(obj, "");
  return flattened;
};
