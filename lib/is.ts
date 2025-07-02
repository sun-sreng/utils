import { Buffer } from "node:buffer";
import process from "node:process";

export const isClient = typeof window !== "undefined";

export const isServer = typeof window === "undefined";

/**
 * Checks if the given value is an array.
 */
export const isArray = (input: unknown): input is unknown[] => Array.isArray(input);

/**
 * Checks if the given value is a boolean primitive.
 */
export const isBoolean = (value: unknown) => typeof value === "boolean";

/**
 * Checks if the current environment is a development environment.
 * Returns true if NODE_ENV is 'development' or 'test'.
 */
export const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

/**
 * Checks if the given value is empty.
 */
export const isEmpty = (input: unknown): boolean => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input).length === 0) ||
    (isArray(input) && (input as unknown[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  );
};

/**
 * Checks if the given value is a function.
 */
export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
  return typeof value === "function";
};

/**
 * Checks if navigator is available.
 */
export const isNavigator = typeof navigator !== "undefined";

/**
 * Checks if the given value is a number.
 */
export const isNumber = (value: unknown): boolean => typeof value === "number" && Number.isNaN(value) === false;

/**
 * Checks if the given value is an object.
 * Returns true if the value is not null and is of type 'object'.
 */
export const isObject = (value: unknown) => value !== null && typeof value === "object";

/**
 * Checks if the given value is a string primitive.
 */
export const isString = (value: unknown) => typeof value === "string";

/**
 * Checks if the given value is a symbol.
 */
export function isSymbol(value: unknown): boolean {
  return typeof value === "symbol" || (value != null && typeof value === "object" && Object.prototype.toString.call(value) === "[object Symbol]");
}

/**
 * Is token expired?
 *
 * @param token - JWT token to check
 * @param offsetSeconds - Optional offset in seconds to consider token expired earlier
 * @returns true if token is expired or invalid, false if valid
 */
export function isTokenExpired(token: string, offsetSeconds = 0): boolean {
  if (!token) return true;

  try {
    const exp = getTokenExpClaim(token);
    if (typeof exp !== "number") return true;
    return !(exp * 1000 > Date.now() + offsetSeconds * 1000);
  } catch {
    return true;
  }
}

/**
 * Checks if the given value is undefined.
 *
 * @param value - The value to check.
 * @returns Whether the value is undefined.
 */
export const isUndef = (value: unknown) => typeof value === "undefined";

/**
 * Checks if the given url is valid
 * @param url - The url to check
 * @returns True if url is valid, false otherwise
 */
export function isUrl(url: string | URL): boolean {
  try {
    const parsedUrl = typeof url === "string" ? new URL(url) : url;

    // Additional check for valid protocols if the URL is a string
    if (typeof url === "string" && !["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Utility type for component validation results
 */
export type ComponentValidationResult = {
  valid: boolean;
  errors: string[];
};

/**
 * Comprehensive validation for component names
 * @param name - The component name to validate
 * @param options - Validation options
 * @returns Validation result with detailed feedback
 * @example
 * isValidComponentName("my-component") // { valid: true, errors: [] }
 * isValidComponentName("") // { valid: false, errors: ["Name cannot be empty"] }
 * isValidComponentName("My-Component") // { valid: false, errors: ["Name must be lowercase"] }
 */
export function isValidComponentName(
  name: string,
  options: {
    allowEmpty?: boolean;
    minLength?: number;
    maxLength?: number;
  } = {}
): ComponentValidationResult {
  const { allowEmpty = false, minLength = 1, maxLength = 50 } = options;

  const errors: string[] = [];

  // Type check
  if (typeof name !== "string") {
    errors.push("Name must be a string");
    return { valid: false, errors };
  }

  // Empty check
  if (!allowEmpty && (!name || name.trim().length === 0)) {
    errors.push("Name cannot be empty");
    return { valid: false, errors };
  }

  // Length checks
  if (name.length < minLength) {
    errors.push(`Name must be at least ${minLength} characters long`);
  }

  if (name.length > maxLength) {
    errors.push(`Name must be no more than ${maxLength} characters long`);
  }

  // Format validation for kebab-case
  const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(name)) {
    if (!/^[a-z]/.test(name)) {
      errors.push("Name must start with a lowercase letter");
    }
    if (/[A-Z]/.test(name)) {
      errors.push("Name must be lowercase (use kebab-case)");
    }
    if (/--/.test(name)) {
      errors.push("Name cannot contain consecutive dashes");
    }
    if (/[^a-z0-9-]/.test(name)) {
      errors.push("Name can only contain lowercase letters, numbers, and dashes");
    }
    if (/^-|-$/.test(name)) {
      errors.push("Name cannot start or end with a dash");
    }
  }

  // Reserved name checks
  const reservedNames = ["component", "element", "node", "ref", "key", "props"];
  if (reservedNames.includes(name)) {
    errors.push(`"${name}" is a reserved name`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if the given string is valid JSON.
 *
 * @param str - The string to check.
 * @returns True if the string is valid JSON, false otherwise.
 */
export function isValidJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

/**
 * Extract expiration claim from JWT token
 * @param token - JWT token
 * @returns expiration timestamp in seconds, or null if not found
 */
function getTokenExpClaim(token: string): number | null {
  const payload = decodeJWTPayload(token);
  return payload && typeof payload.exp === "number" ? payload.exp : null;
}

/**
 * Decode JWT payload without signature verification
 * @param token - JWT token
 * @returns decoded payload object
 */
function decodeJWTPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const payload = parts[1] ?? "";
  const json = base64UrlDecode(payload);
  return JSON.parse(json);
}

/**
 * Decode base64url string to UTF-8 string
 * Works in both browser and Node.js environments
 * @param str - base64url encoded string
 * @returns decoded UTF-8 string
 */
function base64UrlDecode(str: string): string {
  // Convert base64url to standard base64
  let base64Str = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  while (base64Str.length % 4) base64Str += "=";

  if (typeof globalThis !== "undefined" && typeof (globalThis as { atob?: (input: string) => string }).atob === "function") {
    // Browser or environments with atob
    return decodeURIComponent(
      Array.prototype.map.call((globalThis as { atob: (input: string) => string }).atob(base64Str), (c: string) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`).join("")
    );
  }
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(base64Str, "base64").toString("utf-8");
  }
  throw new Error("No base64 decoder available");
}
