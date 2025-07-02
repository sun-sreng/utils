import process from "node:process";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { absoluteUrl, isValidUrl, joinPaths } from "./absolute-url.ts";

describe("absoluteUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    // Clear environment variable before each test
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  afterEach(() => {
    // Restore original environment variable
    process.env.NEXT_PUBLIC_APP_URL = originalEnv;
  });

  describe("with default base URL (localhost:3000)", () => {
    it("should return base URL when path is empty string", () => {
      expect(absoluteUrl("")).toBe("http://localhost:3000");
    });

    it("should return base URL when path is null", () => {
      expect(absoluteUrl(null)).toBe("http://localhost:3000");
    });

    it("should return base URL when path is undefined", () => {
      expect(absoluteUrl(undefined)).toBe("http://localhost:3000");
    });

    it("should return base URL when path is whitespace only", () => {
      expect(absoluteUrl("   ")).toBe("http://localhost:3000");
      expect(absoluteUrl("\t\n\r")).toBe("http://localhost:3000");
    });

    it("should create absolute URL with path starting with slash", () => {
      expect(absoluteUrl("/api/users")).toBe("http://localhost:3000/api/users");
      expect(absoluteUrl("/dashboard")).toBe("http://localhost:3000/dashboard");
    });

    it("should create absolute URL with path not starting with slash", () => {
      expect(absoluteUrl("api/users")).toBe("http://localhost:3000/api/users");
      expect(absoluteUrl("dashboard")).toBe("http://localhost:3000/dashboard");
    });

    it("should handle complex paths", () => {
      expect(absoluteUrl("/api/v1/users/123")).toBe("http://localhost:3000/api/v1/users/123");
      expect(absoluteUrl("api/v1/users/123")).toBe("http://localhost:3000/api/v1/users/123");
    });

    it("should handle paths with query parameters", () => {
      expect(absoluteUrl("/search?q=test")).toBe("http://localhost:3000/search?q=test");
      expect(absoluteUrl("search?q=test&page=1")).toBe("http://localhost:3000/search?q=test&page=1");
    });

    it("should handle paths with fragments", () => {
      expect(absoluteUrl("/docs#section1")).toBe("http://localhost:3000/docs#section1");
      expect(absoluteUrl("docs#section1")).toBe("http://localhost:3000/docs#section1");
    });
  });

  describe("with query parameters", () => {
    it("should add query parameters to URL", () => {
      expect(absoluteUrl("/api/users", { query: { id: "123" } })).toBe("http://localhost:3000/api/users?id=123");
      expect(absoluteUrl("/api/users", { query: { id: "123", active: true } })).toBe("http://localhost:3000/api/users?id=123&active=true");
    });

    it("should handle different query parameter types", () => {
      expect(
        absoluteUrl("/api/users", {
          query: { id: 123, active: true, name: "john" },
        })
      ).toBe("http://localhost:3000/api/users?id=123&active=true&name=john");
    });

    it("should skip null and undefined query parameters", () => {
      expect(
        absoluteUrl("/api/users", {
          query: { id: "123", active: null, name: undefined },
        })
      ).toBe("http://localhost:3000/api/users?id=123");
    });

    it("should handle empty query object", () => {
      expect(absoluteUrl("/api/users", { query: {} })).toBe("http://localhost:3000/api/users");
    });

    it("should encode query parameters properly", () => {
      expect(
        absoluteUrl("/api/search", {
          query: { q: "hello world", category: "test&value" },
        })
      ).toBe("http://localhost:3000/api/search?q=hello+world&category=test%26value");
    });
  });

  describe("with fragments", () => {
    it("should add fragment to URL", () => {
      expect(absoluteUrl("/docs", { fragment: "section1" })).toBe("http://localhost:3000/docs#section1");
    });

    it("should encode fragment properly", () => {
      expect(absoluteUrl("/docs", { fragment: "section with spaces" })).toBe("http://localhost:3000/docs#section%20with%20spaces");
    });

    it("should handle empty fragment", () => {
      expect(absoluteUrl("/docs", { fragment: "" })).toBe("http://localhost:3000/docs");
    });
  });

  describe("with custom base URL", () => {
    it("should use custom base URL when provided", () => {
      expect(absoluteUrl("/api/users", { baseUrl: "https://custom.com" })).toBe("https://custom.com/api/users");
    });

    it("should handle custom base URL with trailing slash", () => {
      expect(absoluteUrl("/api/users", { baseUrl: "https://custom.com/" })).toBe("https://custom.com/api/users");
    });

    it("should throw error for invalid base URL", () => {
      expect(() => absoluteUrl("/api/users", { baseUrl: "not-a-url" })).toThrow("Invalid base URL: not-a-url");
    });
  });

  describe("with combined options", () => {
    it("should handle query and fragment together", () => {
      expect(
        absoluteUrl("/api/users", {
          query: { id: "123" },
          fragment: "details",
        })
      ).toBe("http://localhost:3000/api/users?id=123#details");
    });

    it("should handle custom base URL with query and fragment", () => {
      expect(
        absoluteUrl("/api/users", {
          baseUrl: "https://custom.com",
          query: { id: "123", active: true },
          fragment: "details",
        })
      ).toBe("https://custom.com/api/users?id=123&active=true#details");
    });
  });

  describe("with custom base URL from environment", () => {
    it("should use NEXT_PUBLIC_APP_URL when provided", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

      expect(absoluteUrl("/api/users")).toBe("https://example.com/api/users");
      expect(absoluteUrl("api/users")).toBe("https://example.com/api/users");
      expect(absoluteUrl("")).toBe("https://example.com");
    });

    it("should handle base URL with trailing slash", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://example.com/";

      expect(absoluteUrl("/api/users")).toBe("https://example.com/api/users");
      expect(absoluteUrl("api/users")).toBe("https://example.com/api/users");
      expect(absoluteUrl("")).toBe("https://example.com");
    });

    it("should handle base URL with port", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://localhost:8080";

      expect(absoluteUrl("/api/users")).toBe("https://localhost:8080/api/users");
      expect(absoluteUrl("")).toBe("https://localhost:8080");
    });

    it("should handle base URL with subdirectory", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://example.com/app";

      expect(absoluteUrl("/api/users")).toBe("https://example.com/app/api/users");
      expect(absoluteUrl("api/users")).toBe("https://example.com/app/api/users");
      expect(absoluteUrl("")).toBe("https://example.com/app");
    });

    it("should handle base URL with subdirectory and trailing slash", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://example.com/app/";

      expect(absoluteUrl("/api/users")).toBe("https://example.com/app/api/users");
      expect(absoluteUrl("api/users")).toBe("https://example.com/app/api/users");
      expect(absoluteUrl("")).toBe("https://example.com/app");
    });
  });

  describe("edge cases", () => {
    it("should handle path with only slash", () => {
      expect(absoluteUrl("/")).toBe("http://localhost:3000/");
    });

    it("should handle multiple leading slashes in path", () => {
      expect(absoluteUrl("//api/users")).toBe("http://localhost:3000//api/users");
      expect(absoluteUrl("///api/users")).toBe("http://localhost:3000///api/users");
    });

    it("should handle path with trailing slash", () => {
      expect(absoluteUrl("/api/users/")).toBe("http://localhost:3000/api/users/");
      expect(absoluteUrl("api/users/")).toBe("http://localhost:3000/api/users/");
    });

    it("should handle special characters in path", () => {
      expect(absoluteUrl("/api/users/john%20doe")).toBe("http://localhost:3000/api/users/john%20doe");
      expect(absoluteUrl("/api/users/@special")).toBe("http://localhost:3000/api/users/@special");
    });

    it("should handle path with spaces (though not recommended)", () => {
      expect(absoluteUrl("/api/users with spaces")).toBe("http://localhost:3000/api/users with spaces");
    });

    it("should work with different protocols in base URL", () => {
      process.env.NEXT_PUBLIC_APP_URL = "http://example.com";
      expect(absoluteUrl("/api")).toBe("http://example.com/api");

      process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
      expect(absoluteUrl("/api")).toBe("https://example.com/api");
    });

    it("should handle empty environment variable", () => {
      process.env.NEXT_PUBLIC_APP_URL = "";
      expect(absoluteUrl("/api")).toBe("http://localhost:3000/api");
    });
  });

  describe("type safety", () => {
    it("should accept optional parameters without TypeScript errors", () => {
      // These should compile without TypeScript errors
      expect(() => absoluteUrl()).not.toThrow();
      expect(() => absoluteUrl(undefined)).not.toThrow();
      expect(() => absoluteUrl(null)).not.toThrow();
      expect(() => absoluteUrl("")).not.toThrow();
    });
  });
});

describe("isValidUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
    expect(isValidUrl("https://api.example.com/v1/users")).toBe(true);
    expect(isValidUrl("ftp://files.example.com")).toBe(true);
  });

  it("should return false for invalid URLs", () => {
    expect(isValidUrl("not-a-url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("example.com")).toBe(false);
    expect(isValidUrl("//example.com")).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(isValidUrl("https://")).toBe(false);
    expect(isValidUrl("http://")).toBe(false);
    expect(isValidUrl("://example.com")).toBe(false);
  });
});

describe("joinPaths", () => {
  it("should join path segments correctly", () => {
    expect(joinPaths(["api", "users", "123"])).toBe("/api/users/123");
    expect(joinPaths(["", "api", "users"])).toBe("/api/users");
    expect(joinPaths(["api", "", "users"])).toBe("/api/users");
  });

  it("should handle segments with leading/trailing slashes", () => {
    expect(joinPaths(["/api", "/users", "/123"])).toBe("/api/users/123");
    expect(joinPaths(["api/", "users/", "123/"])).toBe("/api/users/123");
  });

  it("should filter out null and undefined segments", () => {
    expect(joinPaths(["api", null, "users", undefined, "123"])).toBe("/api/users/123");
  });

  it("should handle empty segments", () => {
    expect(joinPaths(["", "", ""])).toBe("/");
    expect(joinPaths([])).toBe("/");
  });

  it("should handle single segment", () => {
    expect(joinPaths(["api"])).toBe("/api");
    expect(joinPaths(["/api"])).toBe("/api");
  });
});
