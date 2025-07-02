/**
 * A union of supported string case types.
 */
export type CaseType =
  | "lowercase"
  | "uppercase"
  | "sentence"
  | "title"
  | "snake"
  | "kebab"
  | "camel"
  | "pascal"
  | "dot"
  | "constant"

/**
 * Extracts words from a string, intelligently handling various formats like
 * camelCase, PascalCase, snake_case, and kebab-case.
 * @param input The string to process.
 * @returns An array of words.
 */
export function extractWords(input: string): string[] {
  if (typeof input !== "string" || !input.trim()) {
    return []
  }

  // This single regex handles multiple splitting scenarios:
  // 1. `[^a-zA-Z0-9]+`: Splits by any non-alphanumeric characters (like spaces, _, -).
  // 2. `(?<=[a-z])(?=[A-Z])`: Splits camelCase (e.g., "myVariable").
  // 3. `(?<=[A-Z])(?=[A-Z][a-z])`: Splits acronyms followed by words (e.g., "HTTPRequest").
  // 4. `(?<=[a-zA-Z])(?=[0-9])`: Splits letters followed by numbers (e.g., "version2").
  // 5. `(?<=[0-9])(?=[a-zA-Z])`: Splits numbers followed by letters (e.g., "2ndEdition").
  const regex =
    /[^a-zA-Z0-9]+|(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[a-zA-Z])(?=[0-9])|(?<=[0-9])(?=[a-zA-Z])/

  // Split the string, filter out empty strings, and trim whitespace
  return input.split(regex).filter((word) => word.trim().length > 0)
}

/**
 * Converts a string into a specified case format.
 * @param input The string to convert.
 * @param caseType The target case format.
 * @returns The converted string.
 */
export function convertCase(input: string, caseType: CaseType): string {
  if (typeof input !== "string") {
    return ""
  }

  const words = extractWords(input)

  if (words.length === 0) {
    return ""
  }

  // Helper to capitalize a word (e.g., "word" -> "Word").
  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

  switch (caseType) {
    case "lowercase":
      return words.map((w) => w.toLowerCase()).join(" ")

    case "uppercase":
      return words.map((w) => w.toUpperCase()).join(" ")

    case "sentence":
      const sentence = words.map((w) => w.toLowerCase()).join(" ")
      return capitalize(sentence)

    case "title":
      return words.map(capitalize).join(" ")

    case "snake":
      return words.map((w) => w.toLowerCase()).join("_")

    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-")

    case "camel":
      return words.length === 1
        ? words[0]!.toLowerCase()
        : words[0]!.toLowerCase() + words.slice(1).map(capitalize).join("")

    case "pascal":
      return words.map(capitalize).join("")

    case "dot":
      return words.map((w) => w.toLowerCase()).join(".")

    case "constant":
      return words.map((w) => w.toUpperCase()).join("_")

    default:
      // This ensures that if a new CaseType is added, the compiler will
      // raise an error if it's not handled in the switch statement.
      const _exhaustiveCheck: never = caseType
      throw new Error(`Unsupported case type: ${_exhaustiveCheck}`)
  }
}

/**
 * Utility function to convert strings to common case formats with shorter names.
 */
export const toCase = {
  lower: (input: string) => convertCase(input, "lowercase"),
  upper: (input: string) => convertCase(input, "uppercase"),
  sentence: (input: string) => convertCase(input, "sentence"),
  title: (input: string) => convertCase(input, "title"),
  snake: (input: string) => convertCase(input, "snake"),
  kebab: (input: string) => convertCase(input, "kebab"),
  camel: (input: string) => convertCase(input, "camel"),
  pascal: (input: string) => convertCase(input, "pascal"),
  dot: (input: string) => convertCase(input, "dot"),
  constant: (input: string) => convertCase(input, "constant"),
}
