import process from "node:process";
/**
 * Creates an absolute URL by combining a base URL with a relative path.
 *
 * @param path - The relative path to append to the base URL. Can be null, undefined, or empty.
 * @param options - Optional configuration for URL generation.
 * @returns The absolute URL string.
 *
 * @example
 * ```typescript
 * absoluteUrl("/api/users") // "https://example.com/api/users"
 * absoluteUrl("api/users")  // "https://example.com/api/users"
 * absoluteUrl("")           // "https://example.com"
 * absoluteUrl(null)         // "https://example.com"
 * absoluteUrl("/api/users", { query: { id: "123" } }) // "https://example.com/api/users?id=123"
 * absoluteUrl("/api/users", { fragment: "section1" }) // "https://example.com/api/users#section1"
 * ```
 */
export function absoluteUrl(
  path?: string | null,
  options?: {
    query?: Record<string, string | number | boolean | null | undefined>;
    fragment?: string;
    baseUrl?: string;
  },
): string {
  const baseUrl = options?.baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Validate base URL
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(`Invalid base URL: ${baseUrl}`);
  }

  // Remove trailing slash from baseUrl for consistency
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  // Handle empty, null, undefined, or whitespace-only path
  if (!path?.trim()) {
    return buildUrl(cleanBaseUrl, "", options);
  }

  // Ensure path starts with '/'
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return buildUrl(cleanBaseUrl, normalizedPath, options);
}

/**
 * Builds a complete URL with query parameters and fragment.
 */
function buildUrl(
  baseUrl: string,
  path: string,
  options?: {
    query?: Record<string, string | number | boolean | null | undefined>;
    fragment?: string;
  },
): string {
  let url = `${baseUrl}${path}`;

  // Add query parameters
  if (options?.query && Object.keys(options.query).length > 0) {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(options.query)) {
      if (value !== null && value !== undefined) {
        queryParams.append(key, String(value));
      }
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Add fragment
  if (options?.fragment) {
    url += `#${encodeURIComponent(options.fragment)}`;
  }

  return url;
}

/**
 * Validates if a string is a valid URL.
 *
 * @param url - The URL string to validate.
 * @returns True if the URL is valid, false otherwise.
 *
 * @example
 * ```typescript
 * isValidUrl("https://example.com") // true
 * isValidUrl("not-a-url") // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Joins multiple URL path segments together.
 *
 * @param segments - Array of path segments to join.
 * @returns The joined path string.
 *
 * @example
 * ```typescript
 * joinPaths(["api", "users", "123"]) // "/api/users/123"
 * joinPaths(["", "api", "users"]) // "/api/users"
 * ```
 */
export function joinPaths(segments: (string | null | undefined)[]): string {
  return (
    "/" +
    segments
      .filter(Boolean)
      .map((segment) => segment?.replace(/^\/+|\/+$/g, ""))
      .filter(Boolean)
      .join("/")
  );
}
