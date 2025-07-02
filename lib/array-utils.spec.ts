import { describe, expect, it } from "vitest";
import * as arrayUtils from "./array-utils.ts";

describe("array-utils", () => {
  it("chunk splits array into chunks of given size", () => {
    expect(arrayUtils.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(arrayUtils.chunk([], 2)).toEqual([]);
    expect(() => arrayUtils.chunk([1, 2], 0)).toThrow();
  });

  it("unique returns unique elements", () => {
    expect(arrayUtils.unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    expect(arrayUtils.unique([])).toEqual([]);
  });

  it("uniqueBy returns unique elements by key", () => {
    expect(arrayUtils.uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], (x) => x.id)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("groupBy groups by key", () => {
    expect(arrayUtils.groupBy(["a", "aa", "b"], (x) => x[0] as string)).toEqual({ a: ["a", "aa"], b: ["b"] });
  });

  it("flattenArray flattens one level", () => {
    expect(arrayUtils.flattenArray([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  it("flattenDeepArray deeply flattens", () => {
    expect(arrayUtils.flattenDeepArray([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("intersection returns common elements", () => {
    expect(arrayUtils.intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });

  it("difference returns elements in first but not second", () => {
    expect(arrayUtils.difference([1, 2, 3], [2, 4])).toEqual([1, 3]);
  });

  it("symmetricDifference returns elements in either but not both", () => {
    expect(arrayUtils.symmetricDifference([1, 2], [2, 3])).toEqual([1, 3]);
  });

  it("partition splits by predicate", () => {
    expect(arrayUtils.partition([1, 2, 3, 4], (x) => x % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("compact removes falsy values", () => {
    expect(arrayUtils.compact([0, 1, false, 2, "", 3, null, undefined])).toEqual([1, 2, 3]);
  });

  it("take and takeRight", () => {
    expect(arrayUtils.take([1, 2, 3], 2)).toEqual([1, 2]);
    expect(arrayUtils.takeRight([1, 2, 3], 2)).toEqual([2, 3]);
  });

  it("drop and dropRight", () => {
    expect(arrayUtils.drop([1, 2, 3], 1)).toEqual([2, 3]);
    expect(arrayUtils.dropRight([1, 2, 3], 1)).toEqual([1, 2]);
  });

  it("shuffle returns array of same length and elements", () => {
    const arr = [1, 2, 3, 4];
    const result = arrayUtils.shuffle(arr);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual(arr);
  });

  it("sample returns n random elements", () => {
    const arr = [1, 2, 3, 4];
    expect(arrayUtils.sample(arr, 2)).toHaveLength(2);
    expect(arrayUtils.sample(arr, 10).sort()).toEqual(arr);
  });

  it("sortBy sorts by selectors", () => {
    const arr = [
      { a: 2, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 1 },
    ];
    expect(
      arrayUtils.sortBy(
        arr,
        (x) => x.a,
        (x) => x.b,
      ),
    ).toEqual([
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
    ]);
  });

  it("groupConsecutive groups consecutive by key", () => {
    expect(arrayUtils.groupConsecutive([1, 1, 2, 2, 1], (x) => x)).toEqual([[1, 1], [2, 2], [1]]);
  });

  it("maxBy and minBy", () => {
    const arr = [{ v: 1 }, { v: 3 }, { v: 2 }];
    expect(arrayUtils.maxBy(arr, (x) => x.v)).toEqual({ v: 3 });
    expect(arrayUtils.minBy(arr, (x) => x.v)).toEqual({ v: 1 });
  });

  it("sumBy and meanBy", () => {
    const arr = [{ v: 1 }, { v: 2 }, { v: 3 }];
    expect(arrayUtils.sumBy(arr, (x) => x.v)).toBe(6);
    expect(arrayUtils.meanBy(arr, (x) => x.v)).toBe(2);
  });

  it("countBy counts by key", () => {
    expect(arrayUtils.countBy(["a", "b", "a"], (x) => x)).toEqual({
      a: 2,
      b: 1,
    });
  });

  it("zip zips arrays", () => {
    expect(arrayUtils.zip([1, 2], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
    expect(arrayUtils.zip([1], ["a", "b"])).toEqual([
      [1, "a"],
      [undefined, "b"],
    ]);
  });
});
