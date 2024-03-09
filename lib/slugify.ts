/**
 * Slugify the provided string arguments by normalizing accents,
 * converting to lowercase, removing non-alphanumeric characters,
 * replacing spaces with dashes, and trimming.
 */
export function slugify(value: string): string {
  if (!value) return "";

  return value
    .normalize("NFD") // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/&/g, " ") // Replace & with ' '
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
}
