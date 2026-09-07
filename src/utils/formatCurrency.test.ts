import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats a typical amount in de-DE style: thousands dot, comma decimal", () => {
    expect(formatCurrency(1234.56)).toBe(`1.234,56\u00A0€`);
  });

  it("keeps the sign before the digits for a negative amount", () => {
    expect(formatCurrency(-132.4)).toBe(`-132,40\u00A0€`);
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe(`0,00\u00A0€`);
  });

  it("gets multiple thousands separators for a large amount", () => {
    expect(formatCurrency(1_000_000)).toBe(`1.000.000,00\u00A0€`);
  });

  it("renders negative zero with a sign -- documents why classifyAmount normalizes -0 to 0 upstream, since this function does not", () => {
    expect(formatCurrency(-0)).toBe(`-0,00\u00A0€`);
  });
});
