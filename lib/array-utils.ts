// Enhanced Array utilities with improved type safety and additional functions

/**
 * Splits an array into chunks of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) throw new Error("Chunk size must be greater than 0");
  if (array.length === 0) return [];

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) => array.slice(index * size, index * size + size));
};

/**
 * Returns unique elements from an array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Returns unique elements based on a key function
 */
export const uniqueBy = <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Groups array elements by a key function
 */
export const groupBy = <T, K extends string | number | symbol>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce(
    (groups, item) => {
      const group = key(item);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
};

/**
 * Flattens a nested array by one level
 */
export const flattenArray = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((acc, val) => (Array.isArray(val) ? acc.concat(val) : acc.concat([val])), []);
};

/**
 * Deeply flattens a nested array
 */
export const flattenDeepArray = <T>(array: (T | (T | T[])[])[]): T[] => {
  return array.reduce<T[]>(
    (acc, val) => Array.isArray(val) ? acc.concat(flattenDeepArray(val as (T | (T | T[])[])[])) : acc.concat(val as T),
    [],
  );
};

/**
 * Returns the intersection of two arrays
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  const set2 = new Set(array2);
  return unique(array1.filter((item) => set2.has(item)));
};

/**
 * Returns the difference between two arrays (items in first but not second)
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  const set2 = new Set(array2);
  return array1.filter((item) => !set2.has(item));
};

/**
 * Returns the symmetric difference between two arrays
 */
export const symmetricDifference = <T>(array1: T[], array2: T[]): T[] => {
  return [...difference(array1, array2), ...difference(array2, array1)];
};

/**
 * Partitions an array into two arrays based on a predicate
 */
export const partition = <T>(array: T[], predicate: (item: T, index: number) => boolean): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];

  array.forEach((item, index) => {
    if (predicate(item, index)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
};

/**
 * Removes falsy values from an array
 */
export const compact = <T>(array: (T | null | undefined | false | 0 | "")[]): T[] => {
  return array.filter(Boolean) as T[];
};

/**
 * Takes n elements from the beginning of an array
 */
export const take = <T>(array: T[], n: number): T[] => {
  return array.slice(0, Math.max(0, n));
};

/**
 * Takes elements from the end of an array
 */
export const takeRight = <T>(array: T[], n: number): T[] => {
  return n === 0 ? [] : array.slice(-n);
};

/**
 * Drops n elements from the beginning of an array
 */
export const drop = <T>(array: T[], n: number): T[] => {
  return array.slice(Math.max(0, n));
};

/**
 * Drops elements from the end of an array
 */
export const dropRight = <T>(array: T[], n: number): T[] => {
  return n === 0 ? [...array] : array.slice(0, -n);
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
};

/**
 * Returns a random sample of n elements from an array
 */
export const sample = <T>(array: T[], n: number = 1): T[] => {
  if (n >= array.length) return shuffle(array);

  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
};

/**
 * Sorts an array by multiple criteria
 */
export const sortBy = <T>(array: T[], ...selectors: ((item: T) => unknown)[]): T[] => {
  return [...array].sort((a, b) => {
    for (const selector of selectors) {
      const aVal = selector(a) as number | string | boolean | undefined | null;
      const bVal = selector(b) as number | string | boolean | undefined | null;
      if (aVal! < bVal!) return -1;
      if (aVal! > bVal!) return 1;
    }
    return 0;
  });
};

/**
 * Creates an array of arrays, grouping consecutive elements by a key function
 */
export const groupConsecutive = <T, K>(array: T[], keyFn: (item: T) => K): T[][] => {
  if (array.length === 0) return [];

  const result: T[][] = [];
  let currentGroup: T[] = [array[0] as T];
  let currentKey = keyFn(array[0] as T);

  for (let i = 1; i < array.length; i++) {
    const key = keyFn(array[i] as T);
    if (key === currentKey) {
      currentGroup.push(array[i] as T);
    } else {
      result.push(currentGroup);
      currentGroup = [array[i] as T];
      currentKey = key;
    }
  }

  result.push(currentGroup);
  return result;
};

/**
 * Finds the maximum element in an array based on a selector function
 */
export const maxBy = <T>(array: T[], selector: (item: T) => number): T | undefined => {
  if (array.length === 0) return undefined;

  return array.reduce((max, current) => (selector(current) > selector(max) ? current : max));
};

/**
 * Finds the minimum element in an array based on a selector function
 */
export const minBy = <T>(array: T[], selector: (item: T) => number): T | undefined => {
  if (array.length === 0) return undefined;

  return array.reduce((min, current) => (selector(current) < selector(min) ? current : min));
};

/**
 * Calculates the sum of array elements based on a selector function
 */
export const sumBy = <T>(array: T[], selector: (item: T) => number): number => {
  return array.reduce((sum, item) => sum + selector(item), 0);
};

/**
 * Calculates the average of array elements based on a selector function
 */
export const meanBy = <T>(array: T[], selector: (item: T) => number): number => {
  if (array.length === 0) return 0;
  return sumBy(array, selector) / array.length;
};

/**
 * Counts occurrences of each element in an array
 */
export const countBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, number> => {
  return array.reduce(
    (counts, item) => {
      const key = keyFn(item);
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    },
    {} as Record<K, number>,
  );
};

/**
 * Zips multiple arrays together
 */
export const zip = <T extends readonly unknown[][]>(
  ...arrays: T
): Array<{ [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never }> => {
  if (arrays.length === 0) return [];
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result: Array<
    {
      [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never;
    }
  > = [];
  for (let i = 0; i < maxLength; i++) {
    result.push(
      arrays.map((arr) => arr[i]) as {
        [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never;
      },
    );
  }
  return result;
};
