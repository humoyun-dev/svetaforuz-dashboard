// currency.test.ts
import { describe, it, expect } from "vitest";
import {
  convertCurrency,
  formatCurrencyPure,
  unFormatCurrencyPure,
} from "../lib/currency";

describe("convertCurrency", () => {
  it("should return same amount when source and target match", () => {
    expect(
      convertCurrency({
        number: "100",
        currency: "USD",
        rate: 12000,
        appCurrency: "USD",
      }),
    ).toBe(100);
  });

  it("should convert USD to UZS", () => {
    expect(
      convertCurrency({
        number: "10,1",
        currency: "USD",
        rate: 12000,
        appCurrency: "UZS",
      }),
    ).toBe(121200);
  });

  it("should convert UZS to USD", () => {
    expect(
      convertCurrency({
        number: 120000,
        currency: "UZS",
        rate: 12000,
        appCurrency: "USD",
      }),
    ).toBe(10);
  });

  it("should handle string numbers with commas", () => {
    expect(
      convertCurrency({
        number: "1,234",
        currency: "USD",
        rate: 12000,
        appCurrency: "UZS",
      }),
    ).toBeCloseTo(1.234 * 12000);
  });
});

describe("formatCurrencyPure", () => {
  it("should format USD with 2 decimals", () => {
    expect(
      formatCurrencyPure({
        number: "1234,56",
        currency: "USD",
        rate: 12000,
        appCurrency: "USD",
      }),
    ).toBe("$1 234.56");
  });
});

describe("unFormatCurrencyPure", () => {
  it("should invert formatCurrencyPure conversion", () => {
    const amount = unFormatCurrencyPure({
      number: 120000,
      currency: "UZS",
      rate: 12000,
      appCurrency: "USD",
    });
    expect(amount).toBe(10);
  });
});
