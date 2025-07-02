type JSONPrimitive = string | number | boolean | null | undefined

interface JSONObject {
  [key: string]: JSONValue
}

type JSONArray = Array<JSONValue>

type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * Configuration options for the compactObject function
 */
interface CompactOptions {
  /** Whether to compact arrays recursively (default: true) */
  compactArrays?: boolean
  /** Whether to remove empty arrays (default: false) */
  removeEmptyArrays?: boolean
  /** Custom predicate to determine if a value should be removed */
  isEmpty?: (value: unknown) => boolean
}

/**
 * Default function to check if a value is considered "empty" and should be removed
 */
function isEmptyValue(value: unknown): boolean {
  return value === "" || value === undefined || value === null
}

/**
 * Recursively removes empty values from an object.
 * By default, removes: `''`, `undefined`, `null`, and empty objects.
 *
 * @param obj - The object to compact
 * @param options - Configuration options for compacting behavior
 * @returns A new object with empty values removed
 *
 * @example
 * ```ts
 * const input = {
 *   name: "John",
 *   email: "",
 *   address: {
 *     street: "123 Main St",
 *     city: null,
 *     nested: {}
 *   },
 *   tags: ["tag1", "", "tag2"]
 * }
 *
 * const result = compactObject(input)
 * // Result: { name: "John", address: { street: "123 Main St" }, tags: ["tag1", "tag2"] }
 * ```
 */
export function compactObject<T extends Record<string, unknown>>(obj: T, options: CompactOptions = {}): Partial<T> {
  const { compactArrays = true, removeEmptyArrays = false, isEmpty = isEmptyValue } = options

  const result: Partial<T> = {}

  for (const [key, value] of Object.entries(obj)) {
    // Skip empty values
    if (isEmpty(value)) {
      continue
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (compactArrays) {
        const compactedArray = value
          .filter((item) => !isEmpty(item))
          .map((item) => {
            // Recursively compact nested objects within arrays
            if (item && typeof item === "object" && !Array.isArray(item)) {
              const compactedItem = compactObject(item as Record<string, unknown>, options)
              // Only include the object if it has properties after compacting
              return Object.keys(compactedItem).length > 0 ? compactedItem : null
            }
            return item
          })
          .filter((item) => item !== null) // Remove any objects that became empty after compacting

        if (!removeEmptyArrays || compactedArray.length > 0) {
          result[key as keyof T] = compactedArray as T[keyof T]
        }
      } else {
        result[key as keyof T] = value as T[keyof T]
      }
      continue
    }

    // Handle nested objects
    if (value && typeof value === "object") {
      const compactedNested = compactObject(value as Record<string, unknown>, options)

      // Only include the nested object if it has properties after compacting
      if (Object.keys(compactedNested).length > 0) {
        result[key as keyof T] = compactedNested as T[keyof T]
      }
      continue
    }

    // Handle primitive values (string, number, boolean)
    result[key as keyof T] = value as T[keyof T]
  }

  return result
}

/**
 * A more restrictive version that only works with JSON-serializable objects
 * and provides better type safety for JSON use cases.
 */
export function compactJSONObject<T extends JSONObject>(obj: T, options: CompactOptions = {}): Partial<T> {
  return compactObject(obj, options) as Partial<T>
}
