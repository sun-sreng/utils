import { describe, expect, it } from "vitest";

import { formatNumber, numberToWord, numberToWordKm, toASCII, toKhmer } from "./number.ts";

describe("number", () => {
  it("to khmer", () => {
    expect(toKhmer("0123456789០១២៣៤៥៦៧៨៩abc")).toEqual("០១២៣៤៥៦៧៨៩០១២៣៤៥៦៧៨៩abc");
  });
  it("to ascii", () => {
    expect(toASCII("០១២៣៤៥៦៧៨៩0123456789abc")).toEqual("01234567890123456789abc");
  });
});

describe("formatNumber", () => {
  describe("basic formatting", () => {
    it("should format numbers with K suffix", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(1234)).toBe("1.2K");
      expect(formatNumber(9876)).toBe("9.9K");
      expect(formatNumber(12345)).toBe("12.3K");
    });

    it("should format numbers with M suffix", () => {
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(1234567)).toBe("1.2M");
      expect(formatNumber(9876543)).toBe("9.9M");
      expect(formatNumber(12345678)).toBe("12.3M");
    });

    it("should format numbers with B suffix", () => {
      expect(formatNumber(1000000000)).toBe("1B");
      expect(formatNumber(1234567890)).toBe("1.2B");
      expect(formatNumber(9876543210)).toBe("9.9B");
      expect(formatNumber(12345678901)).toBe("12.3B");
    });

    it("should format numbers with T suffix", () => {
      expect(formatNumber(1000000000000)).toBe("1T");
      expect(formatNumber(1234567890123)).toBe("1.2T");
      expect(formatNumber(9876543210987)).toBe("9.9T");
    });

    it("should format numbers with P suffix", () => {
      expect(formatNumber(1000000000000000)).toBe("1P");
      expect(formatNumber(1234567890123456)).toBe("1.2P");
    });

    it("should format numbers with E suffix", () => {
      expect(formatNumber(1000000000000000000)).toBe("1E");
      expect(formatNumber(1234567890123456789)).toBe("1.2E");
    });

    it("should format small numbers without suffix", () => {
      expect(formatNumber(1)).toBe("1");
      expect(formatNumber(10)).toBe("10");
      expect(formatNumber(100)).toBe("100");
      expect(formatNumber(999)).toBe("999");
    });
  });

  describe("decimal places", () => {
    it("should use default decimal places (1)", () => {
      expect(formatNumber(1234)).toBe("1.2K");
      expect(formatNumber(1567)).toBe("1.6K");
    });

    it("should respect custom decimal places", () => {
      expect(formatNumber(1234, 0)).toBe("1K");
      expect(formatNumber(1234, 2)).toBe("1.23K");
      expect(formatNumber(1234, 3)).toBe("1.234K");
    });

    it("should handle large decimal places", () => {
      expect(formatNumber(1234567, 5)).toBe("1.23457M");
    });

    it("should handle negative decimal places by treating as 0", () => {
      expect(formatNumber(1234, -1)).toBe("1K");
      expect(formatNumber(1234, -5)).toBe("1K");
    });

    it("should remove trailing zeros", () => {
      expect(formatNumber(1000, 2)).toBe("1K");
      expect(formatNumber(1500, 2)).toBe("1.5K");
      expect(formatNumber(1230, 2)).toBe("1.23K");
    });
  });

  describe("negative numbers", () => {
    it("should format negative numbers with K suffix", () => {
      expect(formatNumber(-1000)).toBe("-1K");
      expect(formatNumber(-1234)).toBe("-1.2K");
      expect(formatNumber(-9876)).toBe("-9.9K");
    });

    it("should format negative numbers with M suffix", () => {
      expect(formatNumber(-1000000)).toBe("-1M");
      expect(formatNumber(-1234567)).toBe("-1.2M");
    });

    it("should format negative numbers with B suffix", () => {
      expect(formatNumber(-1000000000)).toBe("-1B");
      expect(formatNumber(-1234567890)).toBe("-1.2B");
    });

    it("should format small negative numbers without suffix", () => {
      expect(formatNumber(-1)).toBe("-1");
      expect(formatNumber(-100)).toBe("-100");
      expect(formatNumber(-999)).toBe("-999");
    });

    it("should handle negative numbers with custom decimal places", () => {
      expect(formatNumber(-1234, 0)).toBe("-1K");
      expect(formatNumber(-1234, 2)).toBe("-1.23K");
    });
  });

  describe("edge cases", () => {
    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(0, 2)).toBe("0");
    });

    it("should handle null and undefined", () => {
      expect(formatNumber(null)).toBe("0");
      expect(formatNumber(undefined)).toBe("0");
      expect(formatNumber()).toBe("0");
    });

    it("should handle very small positive numbers", () => {
      expect(formatNumber(0.1)).toBe("0");
      expect(formatNumber(0.01)).toBe("0");
      expect(formatNumber(0.99)).toBe("0");
    });

    it("should handle very small negative numbers", () => {
      expect(formatNumber(-0.1)).toBe("0");
      expect(formatNumber(-0.01)).toBe("0");
      expect(formatNumber(-0.99)).toBe("0");
    });

    it("should handle fractional numbers correctly", () => {
      expect(formatNumber(1234.56)).toBe("1.2K");
      expect(formatNumber(1234.56, 2)).toBe("1.23K");
      expect(formatNumber(999.9)).toBe("999.9");
    });

    it("should handle exact threshold values", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(999)).toBe("999");
      expect(formatNumber(1000000)).toBe("1M");
      expect(formatNumber(999999)).toBe("1000K");
    });

    it("should handle very large numbers", () => {
      expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe("9P");
    });
  });

  describe("precision and rounding", () => {
    it("should round properly", () => {
      expect(formatNumber(1199, 0)).toBe("1K");
      expect(formatNumber(1199, 1)).toBe("1.2K");
      expect(formatNumber(1195, 1)).toBe("1.2K");
      expect(formatNumber(1194, 1)).toBe("1.2K");
    });

    it("should handle rounding edge cases", () => {
      expect(formatNumber(999.5)).toBe("999.5");
      expect(formatNumber(999.4)).toBe("999.4");
      expect(formatNumber(1999.5)).toBe("2K");
    });

    it("should maintain precision for different scales", () => {
      expect(formatNumber(1234567, 0)).toBe("1M");
      expect(formatNumber(1234567, 1)).toBe("1.2M");
      expect(formatNumber(1234567, 2)).toBe("1.23M");
      expect(formatNumber(1234567, 3)).toBe("1.235M");
    });
  });

  describe("string output format", () => {
    it("should return string type", () => {
      expect(typeof formatNumber(1234)).toBe("string");
      expect(typeof formatNumber(0)).toBe("string");
      expect(typeof formatNumber(null)).toBe("string");
    });

    it("should not include unnecessary decimal points", () => {
      expect(formatNumber(1000)).toBe("1K");
      expect(formatNumber(2000, 0)).toBe("2K");
      expect(formatNumber(1500, 1)).toBe("1.5K");
    });

    it("should format whole numbers cleanly", () => {
      expect(formatNumber(5000)).toBe("5K");
      expect(formatNumber(10000)).toBe("10K");
      expect(formatNumber(100000)).toBe("100K");
    });
  });
});

describe("integration scenarios", () => {
  it("should handle typical dashboard metrics", () => {
    // User counts
    expect(formatNumber(1247)).toBe("1.2K");
    expect(formatNumber(156789)).toBe("156.8K");

    // Revenue
    expect(formatNumber(2500000)).toBe("2.5M");
    expect(formatNumber(1890000000)).toBe("1.9B");

    // Page views
    expect(formatNumber(45678)).toBe("45.7K");
    expect(formatNumber(234567890)).toBe("234.6M");
  });

  it("should work well for data visualization", () => {
    const values = [100, 1500, 25000, 340000, 1200000, 45000000];
    const formatted = values.map((v) => formatNumber(v));

    expect(formatted).toEqual(["100", "1.5K", "25K", "340K", "1.2M", "45M"]);
  });

  it("should handle mixed positive and negative values", () => {
    const values = [-1000, -500, 0, 750, 2500];
    const formatted = values.map((v) => formatNumber(v, 1));

    expect(formatted).toEqual(["-1K", "-500", "0", "750", "2.5K"]);
  });
});

describe("numberToWordKm", () => {
  it("converts numbers to words", () => {
    expect(numberToWordKm(1234567)).toEqual("មួយលាន ពីរសែន បីម៉ឺន បួនពាន់ ប្រាំរយ ហុកសិបប្រាំពីរ");
  });

  it("handles zero", () => {
    expect(numberToWordKm(0)).toEqual("សូន្យ");
  });

  it("handles negative numbers", () => {
    expect(numberToWordKm(-1234567)).toEqual("*ដក*មួយលាន ពីរសែន បីម៉ឺន បួនពាន់ ប្រាំរយ ហុកសិបប្រាំពីរ");
  });

  it("handles decimals", () => {
    expect(numberToWordKm(1234567.89)).toEqual("មួយលាន ពីរសែន បីម៉ឺន បួនពាន់ ប្រាំរយ ហុកសិបប្រាំពីរ ក្បៀស ប្រាំបី ប្រាំបួន");
  });

  // it('handles custom separators', () => {
  //   expect(numberToWordKm(1234567, '-')).toEqual('មួយលាន-ពីរសែន-បីម៉ឺន-បួនពាន់-ប្រាំរយ-ហុកសិបប្រាំពីរ')
  // })
});

describe("numberToWord", () => {
  it('converts 0 to "Zero"', () => {
    expect(numberToWord(0)).toEqual("Zero");
  });

  it("converts single digit numbers to words", () => {
    expect(numberToWord(1)).toEqual("One");
    expect(numberToWord(5)).toEqual("Five");
    expect(numberToWord(9)).toEqual("Nine");
  });

  it("converts teens numbers to words", () => {
    expect(numberToWord(10)).toEqual("Ten");
    expect(numberToWord(15)).toEqual("Fifteen");
    expect(numberToWord(19)).toEqual("Nineteen");
  });

  it("converts tens numbers to words", () => {
    expect(numberToWord(20)).toEqual("Twenty");
    expect(numberToWord(30)).toEqual("Thirty");
    expect(numberToWord(90)).toEqual("Ninety");
  });

  it("converts hundreds numbers to words", () => {
    expect(numberToWord(100)).toEqual("One Hundred");
    expect(numberToWord(500)).toEqual("Five Hundred");
    expect(numberToWord(900)).toEqual("Nine Hundred");
  });

  it("converts thousands numbers to words", () => {
    expect(numberToWord(1000)).toEqual("One Thousand");
    expect(numberToWord(5000)).toEqual("Five Thousand");
    expect(numberToWord(9000)).toEqual("Nine Thousand");
  });

  it("converts large numbers to words", () => {
    expect(numberToWord(1234567)).toEqual("One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven");
  });

  // it('converts large decimals to words', () => {
  //   expect(numberToWord(1234567.89)).toEqual('One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven Point Eight Nine')
  // })

  // it('converts decimals to words', () => {
  //   expect(numberToWord(0.1)).toEqual('Zero Point One')
  //   expect(numberToWord(1.23)).toEqual('One Point Two Three')
  // })
});
