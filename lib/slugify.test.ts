import { assertEquals } from "@std/assert";
import { slugify } from "./slugify.ts";

Deno.test("slugify", () => {
  const actual = slugify(" Git$Hub_ request^% spLit lET_Ter ");
  const expected = "github-request-split-letter";

  assertEquals(actual, expected);
});
