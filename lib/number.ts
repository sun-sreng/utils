const f = (s: string, l: number, r: number, op: number): string => {
  const result: string[] = []
  const len = s.length
  const opConst = op * 6064

  for (let i = 0; i < len; i++) {
    const charCode = s.charCodeAt(i)
    const diff = charCode - l
    const newCharCode = charCode - opConst * (diff * (charCode - r) < 1 ? 1 : 0)
    result.push(String.fromCharCode(newCharCode))
  }

  return result.join("")
}

export const toASCII = (s: string): string => {
  return f(s, 6112, 6121, 1)
}

export const toKhmer = (s: string): string => {
  return f(s, 40, 57, -1)
}

const SINGLE_DIGITS: string[] = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
const TEENS: string[] = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]
const TENS: string[] = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

/**
 * @description
 * Converts a number to its word representation in English.
 * @example
  // Example usage:
  const doubleNumber = 1234567.99
  //result: One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven Point Eight Nine
  const wordRepresentation = convertToWord(doubleNumber)
  console.log(`${doubleNumber} in words: ${wordRepresentation}`)
 */
export function numberToWord(n: number): string {
  const integerPart = n.toString().split(".")[0] ?? "0"
  const fractionalPart = n.toString().split(".")[1] || "0"

  const integerPartWords = convertIntegerToWord(Number(integerPart))
  const fractionalPartWords = convertFractionalToWord(Number(fractionalPart))

  let wordRepresentation = integerPartWords
  if (fractionalPartWords !== "") {
    wordRepresentation += ` Point ${fractionalPartWords}`
  }

  return wordRepresentation
}

function convertIntegerToWord(n: number): string {
  if (n === 0) {
    return SINGLE_DIGITS[0] ?? ""
  }

  let words = ""
  let i = 0

  while (n > 0) {
    if (n % 1000 !== 0) {
      words = `${helper(n % 1000) + (getSuffix(i) ?? "")} ${words}`
    }
    n = Math.floor(n / 1000)
    i++
  }

  return words.trim()
}

function convertFractionalToWord(n: number): string {
  if (Number.isNaN(n) || n <= 0) return ""
  const fractionalDigits = n.toString()
  let fractionalWords = ""
  for (let i = 0; i < fractionalDigits.length; i++) {
    const digitChar = fractionalDigits[i] ?? "0"
    const digit = Number.parseInt(digitChar, 10)
    fractionalWords += `${SINGLE_DIGITS[digit] ?? "Zero"} `
  }

  return fractionalWords.trim()
}

function helper(n: number): string {
  let word = ""

  if (n >= 100) {
    word += `${SINGLE_DIGITS[Math.floor(n / 100)]} Hundred `
    n %= 100
  }

  if (n >= 10 && n <= 19) {
    word += `${TEENS[n - 10]} `
  } else if (n >= 20) {
    word += `${TENS[Math.floor(n / 10)]} `
    n %= 10
  }

  if (n >= 1 && n <= 9) {
    word += `${SINGLE_DIGITS[n]} `
  }

  return word
}

function getSuffix(i: number): string {
  const SUFFIXES: string[] = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"]
  return SUFFIXES[i] ?? ""
}

const SINGLE_DIGITS_KM: string[] = [
  "សូន្យ",
  "មួយ",
  "ពីរ",
  "បី",
  "បួន",
  "ប្រាំ",
  "ប្រាំមួយ",
  "ប្រាំពីរ",
  "ប្រាំបី",
  "ប្រាំបួន",
]
const MULTIPLE_DIGITS_KM: string[] = [
  "",
  "ដប់",
  "ម្ភៃ",
  "សាមសិប",
  "សែសិប",
  "ហាសិប",
  "ហុកសិប",
  "ចិតសិប",
  "ប៉ែតសិប",
  "កៅសិប",
]
const SUFFIX_MAP: Map<number, string> = new Map([
  [2, "រយ"],
  [3, "ពាន់"],
  [4, "ម៉ឺន"],
  [5, "សែន"],
  [6, "លាន"],
  [9, "ប៊ីលាន"],
  [12, "ទ្រីលាន"],
])

/**
 * Converts a number to a string representation in Khmer words.
 *
 * @param value - The number to convert to words
 * @param sep - Separator between number groups, default ' '
 * @param del - Decimal point separator, default ' ក្បៀស '
 * @returns String representation of the number in Khmer words
 * @example
  console.log(numberToWordKm(1234567.89))
  // result: មួយលាន ពីរសែន បីម៉ឺន បួនពាន់ ប្រាំរយ ហុកសិបប្រាំពីរ ក្បៀស ប្រាំបី ប្រាំបួន
 */
export function numberToWordKm(value: number, sep = " ", del = " ក្បៀស "): string {
  if (Number.isNaN(value)) return ""
  if (Number.isInteger(value)) return integer(value, sep)

  const right = value.toString().split(".")[1] ?? ""
  const word = right
    .split("")
    .map((char) => integer(+char))
    .join(sep)
  return integer(Math.floor(value), sep) + del + word
}

const cachedValues: Map<number, string> = new Map()

function getCachedValue(key: number): string | undefined {
  return cachedValues.get(key)
}

function setCachedValue(key: number, value: string): void {
  cachedValues.set(key, value)
}

function integer(value: number, sep = ""): string {
  if (Number.isNaN(value)) return ""
  if (value < 0) return `*ដក*${integer(Math.abs(value), sep)}`
  value = Math.floor(value)

  const cached = getCachedValue(value)
  if (cached) return cached

  let result = ""
  if (value < 10) {
    result = SINGLE_DIGITS_KM[value] ?? ""
  } else if (value < 100) {
    const r = value % 10
    if (r === 0) {
      result = MULTIPLE_DIGITS_KM[Math.floor(value / 10)] ?? ""
    } else {
      result = (MULTIPLE_DIGITS_KM[Math.floor(value / 10)] ?? "") + integer(r, sep)
    }
  } else {
    let i = Math.floor(Math.log10(value))
    while (!SUFFIX_MAP.has(i) && i > 0) {
      i--
    }
    const d = 10 ** i
    const pre = integer(Math.floor(value / d), sep)
    const suf = SUFFIX_MAP.get(i)
    const r = value % d
    if (r === 0) {
      result = pre + (suf ? suf : "")
    } else {
      result = pre + (suf ? suf : "") + sep + integer(r, sep)
    }
  }

  setCachedValue(value, result)
  return result
}

/**
 * Formats a number with standard suffixes (K, M, B, T, etc.).
 *
 * @param value - The number to format. If null, undefined, or 0, returns "0"
 * @param decimalPlaces - Number of decimal places to include. Defaults to 1
 * @returns The formatted number string with appropriate suffix
 *
 * @example
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567, 2) // "1.23M"
 * formatNumber(0) // "0"
 * formatNumber(-1500) // "-1.5K"
 */
export function formatNumber(value?: number | null, decimalPlaces: number = 1): string {
  // Handle edge cases
  if (value === null || value === undefined || value === 0) {
    return "0"
  }

  // Handle negative numbers
  const isNegative = value < 0
  const absoluteValue = Math.abs(value)

  // Standard number suffixes
  const suffixes = [
    { value: 1e18, symbol: "E" }, // Quintillion
    { value: 1e15, symbol: "P" }, // Quadrillion
    { value: 1e12, symbol: "T" }, // Trillion
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }, // Thousand
    { value: 1, symbol: "" }, // Units
  ]

  // Find the appropriate suffix (iterate from largest to smallest)
  const suffix = suffixes.find((item) => absoluteValue >= item.value)

  if (!suffix) {
    return "0"
  }

  // Calculate the scaled value
  const scaledValue = absoluteValue / suffix.value

  // Format with specified decimal places and remove trailing zeros
  const formattedValue = scaledValue.toFixed(Math.max(0, decimalPlaces)).replace(/\.?0+$/, "") // Remove trailing zeros and decimal point if not needed

  // Add negative sign if needed
  const sign = isNegative ? "-" : ""

  return `${sign}${formattedValue}${suffix.symbol}`
}

export const formatCurrency = ({
  amount,
  currencyCode,
  minFractionDigits,
  maxFractionDigits,
  locale = "en-US",
}: {
  amount: number
  currencyCode: string
  minFractionDigits?: number
  maxFractionDigits?: number
  locale?: string
}) =>
  currencyCode
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits,
      }).format(amount)
    : amount.toString()
