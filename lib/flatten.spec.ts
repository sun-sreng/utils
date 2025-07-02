import { describe, expect, it } from "vitest";

import { flatten } from "./flatten.ts";

describe("flatten", () => {
  it("should return a flattened object with keys representing the nested structure", () => {
    const input = {
      name: {
        first: "John",
        last: "Doe",
      },
      age: 30,
      address: {
        city: "New York",
        state: "NY",
        zipCode: 10001,
      },
    };

    const expectedOutput = {
      "name-first": "John",
      "name-last": "Doe",
      age: 30,
      "address-city": "New York",
      "address-state": "NY",
      "address-zipCode": 10001,
    };

    expect(flatten(input)).toEqual(expectedOutput);
  });

  it("should handle objects with arrays as values", () => {
    const input = {
      users: [
        { name: { firstName: "Joe" }, email: "joe@domain.com" },
        { name: { firstName: "Jane" }, email: "jane@domain.com" },
      ],
    };

    const expectedOutput = {
      "users-0-name-firstName": "Joe",
      "users-0-email": "joe@domain.com",
      "users-1-name-firstName": "Jane",
      "users-1-email": "jane@domain.com",
    };

    expect(flatten(input)).toEqual(expectedOutput);
  });

  it("should handle empty objects and return an empty object in response", () => {
    expect(flatten({})).toEqual({});
  });
});
