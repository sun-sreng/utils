import { describe, expect, it } from "vitest";
import type { CaseType } from "./convert-case.ts";
import { convertCase } from "./convert-case.ts";

/**
 * Test suite for the convertCase function.
 * This suite covers all supported case types and various input scenarios,
 * including edge cases and different formatting styles.
 */
describe("convertCase", () => {
  // Test matrix with various inputs to be tested against all case types
  const testInputs = {
    camel: "helloWorld",
    pascal: "HelloWorld",
    snake: "hello_world",
    kebab: "hello-world",
    sentence: "Hello world",
    title: "Hello World",
    upper: "HELLO WORLD",
    lower: "hello world",
    mixed: "helloWorld_from-TYPESCRIPT-v2",
    withNumbers: "version1ToVersion2",
    singleWord: "hello",
    acronym: "HTTPRequest",
    complex: "_$Test1@23$$$$$$$$#StRing_.jpg",
  };

  /**
   * Test suite for 'lowercase' conversion.
   */
  describe("lowercase", () => {
    it("should convert various strings to lowercase with spaces", () => {
      expect(convertCase(testInputs.camel, "lowercase")).toBe("hello world");
      expect(convertCase(testInputs.pascal, "lowercase")).toBe("hello world");
      expect(convertCase(testInputs.snake, "lowercase")).toBe("hello world");
      expect(convertCase(testInputs.mixed, "lowercase")).toBe("hello world from typescript v 2");
      expect(convertCase(testInputs.withNumbers, "lowercase")).toBe("version 1 to version 2");
      expect(convertCase(testInputs.complex, "lowercase")).toBe("test 1 23 st ring jpg");
    });
  });

  /**
   * Test suite for 'uppercase' conversion.
   */
  describe("uppercase", () => {
    it("should convert various strings to uppercase with spaces", () => {
      expect(convertCase(testInputs.camel, "uppercase")).toBe("HELLO WORLD");
      expect(convertCase(testInputs.pascal, "uppercase")).toBe("HELLO WORLD");
      expect(convertCase(testInputs.kebab, "uppercase")).toBe("HELLO WORLD");
      expect(convertCase(testInputs.mixed, "uppercase")).toBe("HELLO WORLD FROM TYPESCRIPT V 2");
      expect(convertCase(testInputs.withNumbers, "uppercase")).toBe("VERSION 1 TO VERSION 2");
      expect(convertCase(testInputs.complex, "uppercase")).toBe("TEST 1 23 ST RING JPG");
    });
  });

  /**
   * Test suite for 'sentence' case conversion.
   */
  describe("sentence", () => {
    it("should convert various strings to sentence case", () => {
      expect(convertCase(testInputs.camel, "sentence")).toBe("Hello world");
      expect(convertCase(testInputs.pascal, "sentence")).toBe("Hello world");
      expect(convertCase(testInputs.upper, "sentence")).toBe("Hello world");
      expect(convertCase(testInputs.mixed, "sentence")).toBe("Hello world from typescript v 2");
      expect(convertCase(testInputs.acronym, "sentence")).toBe("Http request");
      expect(convertCase(testInputs.complex, "sentence")).toBe("Test 1 23 st ring jpg");
    });
  });

  /**
   * Test suite for 'title' case conversion.
   */
  describe("title", () => {
    it("should convert various strings to title case", () => {
      expect(convertCase(testInputs.camel, "title")).toBe("Hello World");
      expect(convertCase(testInputs.snake, "title")).toBe("Hello World");
      expect(convertCase(testInputs.mixed, "title")).toBe("Hello World From Typescript V 2");
      expect(convertCase(testInputs.withNumbers, "title")).toBe("Version 1 To Version 2");
      expect(convertCase(testInputs.acronym, "title")).toBe("Http Request");
      expect(convertCase(testInputs.complex, "title")).toBe("Test 1 23 St Ring Jpg");
    });
  });

  /**
   * Test suite for 'snake_case' conversion.
   */
  describe("snake", () => {
    it("should convert various strings to snake_case", () => {
      expect(convertCase(testInputs.camel, "snake")).toBe("hello_world");
      expect(convertCase(testInputs.pascal, "snake")).toBe("hello_world");
      expect(convertCase(testInputs.kebab, "snake")).toBe("hello_world");
      expect(convertCase(testInputs.title, "snake")).toBe("hello_world");
      expect(convertCase(testInputs.mixed, "snake")).toBe("hello_world_from_typescript_v_2");
      expect(convertCase(testInputs.withNumbers, "snake")).toBe("version_1_to_version_2");
      expect(convertCase(testInputs.complex, "snake")).toBe("test_1_23_st_ring_jpg");
    });
  });

  /**
   * Test suite for 'kebab-case' conversion.
   */
  describe("kebab", () => {
    it("should convert various strings to kebab-case", () => {
      expect(convertCase(testInputs.camel, "kebab")).toBe("hello-world");
      expect(convertCase(testInputs.pascal, "kebab")).toBe("hello-world");
      expect(convertCase(testInputs.snake, "kebab")).toBe("hello-world");
      expect(convertCase(testInputs.title, "kebab")).toBe("hello-world");
      expect(convertCase(testInputs.mixed, "kebab")).toBe("hello-world-from-typescript-v-2");
      expect(convertCase(testInputs.withNumbers, "kebab")).toBe("version-1-to-version-2");
      expect(convertCase(testInputs.complex, "kebab")).toBe("test-1-23-st-ring-jpg");
    });
  });

  /**
   * Test suite for 'camelCase' conversion.
   */
  describe("camel", () => {
    it("should convert various strings to camelCase", () => {
      expect(convertCase(testInputs.pascal, "camel")).toBe("helloWorld");
      expect(convertCase(testInputs.snake, "camel")).toBe("helloWorld");
      expect(convertCase(testInputs.kebab, "camel")).toBe("helloWorld");
      expect(convertCase(testInputs.title, "camel")).toBe("helloWorld");
      expect(convertCase(testInputs.mixed, "camel")).toBe("helloWorldFromTypescriptV2");
      expect(convertCase(testInputs.withNumbers, "camel")).toBe("version1ToVersion2");
      expect(convertCase(testInputs.acronym, "camel")).toBe("httpRequest");
      expect(convertCase(testInputs.complex, "camel")).toBe("test123StRingJpg");
    });
  });

  /**
   * Test suite for 'PascalCase' conversion.
   */
  describe("pascal", () => {
    it("should convert various strings to PascalCase", () => {
      expect(convertCase(testInputs.camel, "pascal")).toBe("HelloWorld");
      expect(convertCase(testInputs.snake, "pascal")).toBe("HelloWorld");
      expect(convertCase(testInputs.kebab, "pascal")).toBe("HelloWorld");
      expect(convertCase(testInputs.title, "pascal")).toBe("HelloWorld");
      expect(convertCase(testInputs.mixed, "pascal")).toBe("HelloWorldFromTypescriptV2");
      expect(convertCase(testInputs.withNumbers, "pascal")).toBe("Version1ToVersion2");
      expect(convertCase(testInputs.acronym, "pascal")).toBe("HttpRequest");
      expect(convertCase(testInputs.complex, "pascal")).toBe("Test123StRingJpg");
    });
  });

  /**
   * Test suite for edge cases.
   */
  describe("edge cases", () => {
    it("should return an empty string for empty or invalid inputs", () => {
      expect(convertCase("", "camel")).toBe("");
      expect(convertCase("   ", "pascal")).toBe("");
      // @ts-expect-error - Testing invalid input type
      expect(convertCase(null, "snake")).toBe("");
      // @ts-expect-error - Testing invalid input type
      expect(convertCase(undefined, "kebab")).toBe("");
    });

    it("should handle single-word inputs correctly", () => {
      expect(convertCase(testInputs.singleWord, "camel")).toBe("hello");
      expect(convertCase(testInputs.singleWord, "pascal")).toBe("Hello");
      expect(convertCase(testInputs.singleWord, "snake")).toBe("hello");
      expect(convertCase(testInputs.singleWord, "title")).toBe("Hello");
    });

    it("should handle strings with leading/trailing non-alphanumeric characters", () => {
      expect(convertCase("__hello-world__", "pascal")).toBe("HelloWorld");
      expect(convertCase("  -hello-world  ", "snake")).toBe("hello_world");
    });

    it("should handle string with only special characters", () => {
      expect(convertCase("!@#$%^&*()", "lowercase")).toBe("");
      expect(convertCase("!@#$%^&*()", "camel")).toBe("");
    });

    it("should handle string with only numbers", () => {
      expect(convertCase("123456", "lowercase")).toBe("123456");
      expect(convertCase("123456", "camel")).toBe("123456");
      expect(convertCase("123456", "snake")).toBe("123456");
    });

    it("should handle HelloWorld correctly", () => {
      expect(convertCase("HelloWorld", "lowercase")).toBe("hello world");
      expect(convertCase("HelloWorld", "camel")).toBe("helloWorld");
      expect(convertCase("HelloWorld", "snake")).toBe("hello_world");
    });

    it("should handle mixed case with numbers", () => {
      expect(convertCase("camelCase123Test", "snake")).toBe("camel_case_123_test");
      expect(convertCase("PascalCase456", "kebab")).toBe("pascal-case-456");
    });

    it("should handle single character", () => {
      expect(convertCase("a", "uppercase")).toBe("A");
      expect(convertCase("1", "lowercase")).toBe("1");
      expect(convertCase("A", "camel")).toBe("a");
      expect(convertCase("A", "pascal")).toBe("A");
    });

    it("should handle consecutive numbers", () => {
      expect(convertCase("test123456end", "snake")).toBe("test_123456_end");
      expect(convertCase("v1.2.3", "camel")).toBe("v123");
    });

    it("should handle underscores and hyphens", () => {
      expect(convertCase("hello_world-test", "camel")).toBe("helloWorldTest");
      expect(convertCase("snake_case_input", "title")).toBe("Snake Case Input");
    });
  });

  describe("Real-world examples", () => {
    const testCases = [
      {
        input: "user-profile.component.ts",
        expected: {
          camel: "userProfileComponentTs",
          pascal: "UserProfileComponentTs",
          snake: "user_profile_component_ts",
          kebab: "user-profile-component-ts",
        },
      },
      {
        input: "API_KEY_V2",
        expected: {
          camel: "apiKeyV2",
          pascal: "ApiKeyV2",
          snake: "api_key_v_2",
          kebab: "api-key-v-2",
        },
      },
      {
        input: "XMLHttpRequest",
        expected: {
          camel: "xmlHttpRequest",
          pascal: "XmlHttpRequest",
          snake: "xml_http_request",
          kebab: "xml-http-request",
        },
      },
      {
        input: "iPhone12Pro",
        expected: {
          camel: "iPhone12Pro",
          pascal: "IPhone12Pro",
          snake: "i_phone_12_pro",
          kebab: "i-phone-12-pro",
        },
      },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should correctly convert "${input}"`, () => {
        expect(convertCase(input, "camel")).toBe(expected.camel);
        expect(convertCase(input, "pascal")).toBe(expected.pascal);
        expect(convertCase(input, "snake")).toBe(expected.snake);
        expect(convertCase(input, "kebab")).toBe(expected.kebab);
      });
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid case type", () => {
      expect(() => {
        convertCase("test", "invalid" as CaseType);
      }).toThrow("Unsupported case type: invalid");
    });
  });

  describe("Type safety", () => {
    it("should accept all valid case types", () => {
      const validCases: CaseType[] = ["lowercase", "uppercase", "sentence", "title", "snake", "kebab", "camel", "pascal"];

      validCases.forEach((caseType) => {
        expect(() => convertCase("test", caseType)).not.toThrow();
      });
    });
  });

  describe("Performance tests", () => {
    it("should handle long strings efficiently", () => {
      const longString = "a".repeat(1000) + "123" + "b".repeat(1000);
      const startTime = performance.now();

      convertCase(longString, "camel");

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });

    it("should handle strings with many special characters", () => {
      const specialString = "!!!".repeat(100) + "test" + "@@@".repeat(100);

      expect(() => convertCase(specialString, "snake")).not.toThrow();
      expect(convertCase(specialString, "snake")).toBe("test");
    });
  });
});
