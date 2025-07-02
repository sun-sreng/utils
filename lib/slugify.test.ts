import { describe, expect, it } from "vitest";
import { slugify } from "./slugify.ts";

describe("slugify", () => {
  it("should convert a string to a slug", () => {
    const input = " Git$Hub_ request^% spLit lET_Ter ";
    const expected = "github-request-split-letter";
    const actual = slugify(input);

    expect(actual).toBe(expected);
  });
});
