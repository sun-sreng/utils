import { expect, it } from "vitest";

import { clsx } from "./clsx.ts";

it("returns empty string for no arguments", () => {
  expect(clsx()).toEqual("");
});

it("returns first argument string when passed", () => {
  expect(clsx("class1")).toEqual("class1");
});

it("joins multiple class names into space separated string", () => {
  expect(clsx("class1", "class2")).toEqual("class1 class2");
});

it("filters out falsy arguments", () => {
  expect(clsx("class1", null, "class2", undefined)).toEqual("class1 class2");
});

it("handles numbers", () => {
  expect(clsx(1, "class1", 2)).toEqual("1 class1 2");
});

it("handles empty string argument", () => {
  expect(clsx("", "class1")).toEqual("class1");
});
