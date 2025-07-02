import { expect, it } from "vitest";

import { cn } from "./cn.ts";

it("returns empty string for no arguments", () => {
  expect(cn()).toEqual("");
});

it("returns first argument string when passed", () => {
  expect(cn("class1")).toEqual("class1");
});

it("joins multiple class names into space separated string", () => {
  expect(cn("class1", "class2")).toEqual("class1 class2");
});

it("filters out falsy arguments", () => {
  expect(cn("class1", null, "class2", undefined)).toEqual("class1 class2");
});

it("handles numbers", () => {
  expect(cn(1, "class1", 2)).toEqual("1 class1 2");
});

it("handles object syntax", () => {
  expect(cn({ foo: true, bar: false, baz: true })).toEqual("foo baz");
});

it("handles array syntax", () => {
  expect(cn(["foo", 0, false, "bar"])).toEqual("foo bar");
});

it("merges tailwind classes using tailwind-merge", () => {
  expect(cn("p-2", "p-4")).toEqual("p-4");
  expect(cn("text-red-500", "text-blue-500")).toEqual("text-blue-500");
});
