import { describe, expect, it } from "vitest";
import { classifyAmount } from "./classifyAmount";
import { TransactionStatus } from "./types";

describe("classifyAmount", () => {
  it("classifies a finite number as settled", () => {
    expect(classifyAmount(123.88)).toEqual({ status: TransactionStatus.Settled, amount: 123.88 });
  });

  it("classifies a valid numeric string as settled, coerced to a number", () => {
    expect(classifyAmount("48.20")).toEqual({ status: TransactionStatus.Settled, amount: 48.2 });
  });

  it("classifies a whitespace-padded numeric string as settled", () => {
    expect(classifyAmount("  48.20  ")).toEqual({ status: TransactionStatus.Settled, amount: 48.2 });
  });

  it("classifies a negative number as settled, with the sign preserved", () => {
    expect(classifyAmount(-100)).toEqual({ status: TransactionStatus.Settled, amount: -100 });
  });

  it("classifies null as pending", () => {
    expect(classifyAmount(null)).toEqual({ status: TransactionStatus.Pending });
  });

  it("classifies undefined as invalid, not pending -- a missing field is not the same signal as an explicit null", () => {
    expect(classifyAmount(undefined)).toEqual({ status: TransactionStatus.Invalid, rawAmount: "undefined" });
  });

  it("classifies an empty string as invalid, not settled at 0 -- Number('') is 0 in JS, and that must not leak through", () => {
    expect(classifyAmount("")).toEqual({ status: TransactionStatus.Invalid, rawAmount: "" });
  });

  it("classifies a whitespace-only string as invalid, for the same reason as an empty string", () => {
    expect(classifyAmount("   ")).toEqual({ status: TransactionStatus.Invalid, rawAmount: "   " });
  });

  it("classifies a non-numeric string ('N/A') as invalid", () => {
    expect(classifyAmount("N/A")).toEqual({ status: TransactionStatus.Invalid, rawAmount: "N/A" });
  });

  it("classifies NaN as invalid", () => {
    expect(classifyAmount(NaN)).toEqual({ status: TransactionStatus.Invalid, rawAmount: "NaN" });
  });

  it("classifies negative zero as settled, normalized to a plain 0", () => {
    const result = classifyAmount(-0);
    expect(result).toEqual({ status: TransactionStatus.Settled, amount: 0 });
    if (result.status === TransactionStatus.Settled) {
      expect(Object.is(result.amount, -0)).toBe(false);
    }
  });

  it("classifies a large finite number as settled", () => {
    expect(classifyAmount(9_000_000_000_000)).toEqual({ status: TransactionStatus.Settled, amount: 9_000_000_000_000 });
  });

  it("classifies Infinity as invalid, not a real settled amount", () => {
    expect(classifyAmount(Infinity)).toEqual({ status: TransactionStatus.Invalid, rawAmount: "Infinity" });
  });

  it("classifies a non-string/number/null type (e.g. a boolean) as invalid", () => {
    expect(classifyAmount(true)).toEqual({ status: TransactionStatus.Invalid, rawAmount: "true" });
  });
});
