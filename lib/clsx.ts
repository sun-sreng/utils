export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean

interface ClassDictionary {
  [key: string]: boolean | undefined | null
}

type ClassArray = Array<ClassValue>

function toVal(value: ClassValue): string {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number") {
    return value === 0 ? "" : String(value)
  }

  if (Array.isArray(value)) {
    return value.map(toVal).filter(Boolean).join(" ")
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .filter(([, v]) => !!v)
      .map(([k]) => k)
      .join(" ")
  }

  return ""
}

/**
 * Joins classNames together.
 *
 * Accepts a variadic number of arguments. Each argument can be a string,
 * number, array, or object mapping strings to boolean values.
 *
 * Returns a single string of class names.
 */
export function clsx(...args: ClassValue[]): string {
  return args.map(toVal).filter(Boolean).join(" ")
}
