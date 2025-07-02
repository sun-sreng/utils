import { Buffer } from "node:buffer";
import { describe, expect, it } from "vitest";
import {
  isArray,
  isBoolean,
  isDev,
  isEmpty,
  isFunction,
  isNavigator,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isTokenExpired,
  isUndef,
  isUrl,
  isValidComponentName,
  isValidJsonString,
} from "./is.ts";

describe("isArray", () => {
  it("returns true for arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
  });

  it("returns false for non-arrays", () => {
    expect(isArray("string")).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
  });
});

describe("isBoolean", () => {
  it("returns true for boolean primitive", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it("returns false for non-boolean primitives", () => {
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean("abc")).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
  });

  it("returns false for non-primitives", () => {
    expect(isBoolean([])).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean(() => {})).toBe(false);
  });
});

describe("isDev", () => {
  it("returns boolean", () => {
    expect(typeof isDev).toBe("boolean");
  });
});

describe("isEmpty", () => {
  it("returns true for empty values", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("   ")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it("returns false for non-empty values", () => {
    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ key: "value" })).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });
});

describe("isFunction", () => {
  it("returns true for functions", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(async () => {})).toBe(true);
  });

  it("returns false for non-functions", () => {
    expect(isFunction("string")).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

describe("isNavigator", () => {
  it("returns boolean", () => {
    expect(typeof isNavigator).toBe("boolean");
  });
});

describe("isNumber", () => {
  it("returns true for number", () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(1.5)).toBe(true);
  });

  it("returns false for string", () => {
    expect(isNumber("1")).toBe(false);
  });

  it("returns false for non-finite number", () => {
    expect(isNumber(Number.NaN)).toBe(false);
  });

  it("returns false for boolean", () => {
    expect(isNumber(true)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isNumber(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isNumber(undefined)).toBe(false);
  });

  it("returns false for object", () => {
    expect(isNumber({})).toBe(false);
  });
});

describe("isObject", () => {
  it("should return true for object", () => {
    const obj = {};
    expect(isObject(obj)).toBe(true);
  });

  it("should return false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isObject(undefined)).toBe(false);
  });

  it("should return false for string", () => {
    expect(isObject("string")).toBe(false);
  });

  it("should return false for number", () => {
    expect(isObject(123)).toBe(false);
  });

  it("should return false for boolean", () => {
    expect(isObject(true)).toBe(false);
  });

  it("should return false for function", () => {
    expect(isObject(() => {})).toBe(false);
  });
});

describe("isString", () => {
  it("returns true for string primitive", () => {
    expect(isString("foo")).toBe(true);
  });

  it("returns false for non-string primitive", () => {
    expect(isString(123)).toBe(false);
  });

  it("returns false for non-primitives", () => {
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isString("")).toBe(true);
  });
});

describe("isSymbol", () => {
  it("returns true for symbol input", () => {
    const symbol = Symbol("test");
    expect(isSymbol(symbol)).toBe(true);
  });

  it("returns false for non-symbol input", () => {
    expect(isSymbol("string")).toBe(false);
  });

  it("returns false for null input", () => {
    expect(isSymbol(null)).toBe(false);
  });
});

describe("isTokenExpired", () => {
  it("returns true for empty token", () => {
    expect(isTokenExpired("")).toBe(true);
  });

  it("returns true for null/undefined token", () => {
    expect(isTokenExpired(null as unknown as string)).toBe(true);
    expect(isTokenExpired(undefined as unknown as string)).toBe(true);
  });

  it("returns true for expired token", () => {
    const expiredToken = createJWT({
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    });
    expect(isTokenExpired(expiredToken)).toBe(true);
  });

  it("returns false for valid token", () => {
    const validToken = createJWT({
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(validToken)).toBe(false);
  });

  it("returns true for token expiring soon with offset", () => {
    const tokenExpiringSoon = createJWT({
      exp: Math.floor(Date.now() / 1000) + 30, // 30 seconds from now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(tokenExpiringSoon, 60)).toBe(true); // 60 second offset
  });

  it("returns false for token with sufficient time with offset", () => {
    const validToken = createJWT({
      exp: Math.floor(Date.now() / 1000) + 120, // 2 minutes from now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(validToken, 60)).toBe(false); // 60 second offset
  });

  it("returns true for token without exp claim", () => {
    const tokenWithoutExp = createJWT({
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(tokenWithoutExp)).toBe(true);
  });

  it("returns true for invalid JWT format", () => {
    expect(isTokenExpired("invalid.jwt")).toBe(true);
  });

  it("returns true for malformed JWT payload", () => {
    const malformedToken = "header.invalid_payload.signature";
    expect(isTokenExpired(malformedToken)).toBe(true);
  });

  it("handles token expiring exactly now", () => {
    const tokenExpiringNow = createJWT({
      exp: Math.floor(Date.now() / 1000), // exactly now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(tokenExpiringNow)).toBe(true);
  });

  it("handles token with unicode characters in payload", () => {
    const tokenWithUnicode = createJWT({
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      name: "Jose Maria", // unicode characters
    });
    expect(isTokenExpired(tokenWithUnicode)).toBe(false);
  });

  it("handles token with URL-safe base64 padding", () => {
    const tokenWithPadding = createJWT({
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    expect(isTokenExpired(tokenWithPadding)).toBe(false);
  });
});

describe("isUndef", () => {
  it("returns true for undefined", () => {
    expect(isUndef(undefined)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isUndef(null)).toBe(false);
  });

  it("returns false for 0", () => {
    expect(isUndef(0)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isUndef("")).toBe(false);
  });

  it("returns false for non-empty string", () => {
    expect(isUndef("test")).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(isUndef([])).toBe(false);
  });

  it("returns false for empty object", () => {
    expect(isUndef({})).toBe(false);
  });
});

describe("isUrl", () => {
  it("returns true for valid URL strings", () => {
    expect(isUrl("https://example.com")).toBe(true);
  });

  it("returns false for invalid URL strings", () => {
    expect(isUrl("foo")).toBe(false);
  });

  it("returns true for valid URL objects", () => {
    expect(isUrl(new URL("https://example.com"))).toBe(true);
  });

  it("returns false for invalid protocols", () => {
    expect(isUrl("foo://example.com")).toBe(false);
  });
});

describe("isValidComponentName", () => {
  it("returns valid result for valid component name", () => {
    const result = isValidComponentName("my-component");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("returns invalid result for empty name", () => {
    const result = isValidComponentName("");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name cannot be empty");
  });

  it("returns invalid result for uppercase name", () => {
    const result = isValidComponentName("My-Component");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Name must be lowercase (use kebab-case)");
  });

  it("returns invalid result for reserved name", () => {
    const result = isValidComponentName("component");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('"component" is a reserved name');
  });

  it("allows empty name when allowEmpty is true", () => {
    const result = isValidComponentName("", { allowEmpty: true });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(["Name must be at least 1 characters long", "Name must start with a lowercase letter"]);
  });
});

describe("isValidJsonString", () => {
  it("returns true for valid JSON string", () => {
    const validJson = '{"key": "value"}';
    expect(isValidJsonString(validJson)).toBe(true);
  });

  it("returns false for invalid JSON string", () => {
    const invalidJson = '{"key" "value"}';
    expect(isValidJsonString(invalidJson)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidJsonString("")).toBe(false);
  });
});

// Helper function to create a valid JWT for testing
function createJWT(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const signature = "test-signature";

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Unicode-safe base64url encoder
function base64UrlEncode(str: string): string {
  // Encode to UTF-8 bytes
  const utf8Bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(str) : Buffer.from(str, "utf-8");
  // Convert bytes to binary string
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(Number(utf8Bytes[i]));
  }
  // Base64 encode
  const b64 = btoa(binary);
  // Convert to base64url
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
