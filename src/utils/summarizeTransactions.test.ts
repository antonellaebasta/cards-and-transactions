import { describe, expect, it } from "vitest";
import { summarizeTransactions } from "./summarizeTransactions";
import { TransactionDirection, TransactionStatus, type Transaction } from "../adapters/types";

const settled = (amount: number): Transaction => ({
  status: TransactionStatus.Settled,
  key: `k-${amount}`,
  id: "id",
  amount,
  direction: amount >= 0 ? TransactionDirection.In : TransactionDirection.Out,
  description: "d",
});
const pending: Transaction = { status: TransactionStatus.Pending, key: "p", id: "id", description: "d" };
const invalid: Transaction = { status: TransactionStatus.Invalid, key: "i", id: "id", description: "d", rawAmount: "N/A" };

describe("summarizeTransactions", () => {
  it("returns a zeroed summary for an empty list", () => {
    expect(summarizeTransactions([])).toEqual({ balance: 0, pendingCount: 0, unavailableCount: 0 });
  });

  it("sums only settled amounts, signed", () => {
    expect(summarizeTransactions([settled(100), settled(-40)])).toEqual({
      balance: 60,
      pendingCount: 0,
      unavailableCount: 0,
    });
  });

  it("gives a zero balance and the correct pending count for an all-pending list", () => {
    expect(summarizeTransactions([pending, pending])).toEqual({ balance: 0, pendingCount: 2, unavailableCount: 0 });
  });

  it("gives a zero balance and the correct unavailable count for an all-invalid list, with no contribution to balance", () => {
    expect(summarizeTransactions([invalid, invalid, invalid])).toEqual({
      balance: 0,
      pendingCount: 0,
      unavailableCount: 3,
    });
  });

  it("computes the balance from settled transactions only, in a mixed list, with counts for the rest", () => {
    expect(summarizeTransactions([settled(50), pending, invalid, settled(25)])).toEqual({
      balance: 75,
      pendingCount: 1,
      unavailableCount: 1,
    });
  });

  it("sums cents-level amounts precisely enough for currency display, despite float precision", () => {
    const result = summarizeTransactions([settled(0.1), settled(0.2)]);
    expect(Math.round(result.balance * 100)).toBe(30);
  });
});
