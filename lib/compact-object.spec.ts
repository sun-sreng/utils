import { describe, expect, it } from "vitest";

import { compactJSONObject, compactObject } from "./compact-object.ts";

const obj = {
  a: "",
  aa: null,
  aaa: undefined,
  aaaa: "aaaa",
  aaaaa: 0,
  aaaaaa: 1,
  aaaaaaa: 2,
  aaaaaaaa: true,
  aaaaaaaaa: false,
  emptyObj: {},
  emptyArray: [],
  obj1: { a: "", aa: null, aaa: undefined, aaaa: "aaaa" },
};

const result = {
  aaaa: "aaaa",
  aaaaa: 0,
  aaaaaa: 1,
  aaaaaaa: 2,
  aaaaaaaa: true,
  aaaaaaaaa: false,
  emptyArray: [], // empty arrays are kept by default
  obj1: {
    aaaa: "aaaa",
  },
};

it("should be equal to result", () => {
  expect(compactObject(obj)).toEqual(result);
});

describe("compactObject", () => {
  it("should remove empty string, null, and undefined values", () => {
    const input = {
      name: "John",
      email: "",
      age: null,
      bio: undefined,
      active: true,
      score: 0,
    };

    const result = compactObject(input);

    expect(result).toEqual({
      name: "John",
      active: true,
      score: 0,
    });
  });

  it("should handle nested objects recursively", () => {
    const input = {
      user: {
        name: "John",
        email: "",
        address: {
          street: "123 Main St",
          city: null,
          country: "USA",
          details: {},
        },
      },
      settings: {},
    };

    const result = compactObject(input);

    expect(result).toEqual({
      user: {
        name: "John",
        address: {
          street: "123 Main St",
          country: "USA",
        },
      },
    });
  });

  it("should compact arrays by default", () => {
    const input = {
      tags: ["tag1", "", "tag2", null, "tag3"],
      categories: ["cat1", "cat2"],
    };

    const result = compactObject(input);

    expect(result).toEqual({
      tags: ["tag1", "tag2", "tag3"],
      categories: ["cat1", "cat2"],
    });
  });

  it("should not compact arrays when compactArrays is false", () => {
    const input = {
      tags: ["tag1", "", "tag2", null, "tag3"],
    };

    const result = compactObject(input, { compactArrays: false });

    expect(result).toEqual({
      tags: ["tag1", "", "tag2", null, "tag3"],
    });
  });

  it("should remove empty arrays when removeEmptyArrays is true", () => {
    const input = {
      tags: ["", null, undefined],
      categories: ["cat1", "cat2"],
      emptyArray: [],
    };

    const result = compactObject(input, { removeEmptyArrays: true });

    expect(result).toEqual({
      categories: ["cat1", "cat2"],
    });
  });

  it("should use custom isEmpty function", () => {
    const input = {
      name: "John",
      email: "EMPTY",
      age: 0,
      tags: ["tag1", "EMPTY", "tag2"],
    };

    const result = compactObject(input, {
      isEmpty: (value) => value === "EMPTY" || value === 0,
    });

    expect(result).toEqual({
      name: "John",
      tags: ["tag1", "tag2"],
    });
  });

  it("should handle complex nested structures", () => {
    const input = {
      level1: {
        level2: {
          level3: {
            value: "",
            keep: "this",
          },
          empty: null,
        },
        array: [
          { name: "item1", value: "" },
          { name: "item2", value: "keep" },
        ],
      },
    };

    const result = compactObject(input);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            keep: "this",
          },
        },
        array: [
          { name: "item1" }, // value: "" is removed from nested objects in arrays
          { name: "item2", value: "keep" },
        ],
      },
    });
  });
});

describe("compactJSONObject", () => {
  it("should work with JSON objects", () => {
    const input = {
      name: "John",
      email: "",
      age: null,
      settings: {
        theme: "dark",
        notifications: undefined,
      },
    };

    const result = compactJSONObject(input);

    expect(result).toEqual({
      name: "John",
      settings: {
        theme: "dark",
      },
    });
  });
});
