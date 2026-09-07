import { describe, expect, it } from "vitest";
import { DirectionFilter, filterTransactions } from "./filterTransactions";
import { TransactionDirection, TransactionStatus, type Transaction } from "../adapters/types";

const settledIn50: Transaction = {
  status: TransactionStatus.Settled,
  key: "s1",
  id: "t1",
  amount: 50,
  direction: TransactionDirection.In,
  description: "Payroll",
};
const settledIn20: Transaction = {
  status: TransactionStatus.Settled,
  key: "s2",
  id: "t2",
  amount: 20,
  direction: TransactionDirection.In,
  description: "Cashback",
};
const settledOut80: Transaction = {
  status: TransactionStatus.Settled,
  key: "s3",
  id: "t3",
  amount: -80,
  direction: TransactionDirection.Out,
  description: "Rent",
};
const settledOut10: Transaction = {
  status: TransactionStatus.Settled,
  key: "s4",
  id: "t4",
  amount: -10,
  direction: TransactionDirection.Out,
  description: "Coffee",
};
const pending: Transaction = { status: TransactionStatus.Pending, key: "p1", id: "t5", description: "Hotel Booking" };
const invalid: Transaction = {
  status: TransactionStatus.Invalid,
  key: "i1",
  id: "t6",
  description: "Corrupted row",
  rawAmount: "N/A",
};

const ALL: Transaction[] = [settledIn50, settledIn20, settledOut80, settledOut10, pending, invalid];

describe("filterTransactions", () => {
  it("includes everything, invalid and pending too, in its default state (minAmount 0, direction all)", () => {
    expect(filterTransactions(ALL, 0, DirectionFilter.All)).toEqual(ALL);
  });

  it("includes an amount exactly equal to minAmount, not just amounts strictly greater (boundary case)", () => {
    const result = filterTransactions(ALL, 50, DirectionFilter.All);
    expect(result).toContainEqual(settledIn50);
    expect(result).toContainEqual(settledOut80);
    expect(result).not.toContainEqual(settledIn20);
    expect(result).not.toContainEqual(settledOut10);
  });

  it("applies the same boundary rule to a negative (outflow) amount, via Math.abs", () => {
    const result = filterTransactions(ALL, 80, DirectionFilter.All);
    expect(result).toContainEqual(settledOut80);
    expect(result).not.toContainEqual(settledOut10);
  });

  it("excludes pending but still includes invalid once minAmount is above 0", () => {
    const result = filterTransactions(ALL, 50, DirectionFilter.All);
    expect(result).not.toContainEqual(pending);
    expect(result).toContainEqual(invalid);
  });

  it("still includes pending when minAmount is 0, since the filter isn't actively engaged", () => {
    const result = filterTransactions(ALL, 0, DirectionFilter.All);
    expect(result).toContainEqual(pending);
  });

  it("lets a negative minAmount behave like 0, trusting its input rather than clamping it", () => {
    expect(filterTransactions(ALL, -10, DirectionFilter.All)).toEqual(ALL);
  });

  it("excludes pending and invalid for direction 'in', even when minAmount is 0", () => {
    const result = filterTransactions(ALL, 0, DirectionFilter.In);
    expect(result).toEqual([settledIn50, settledIn20]);
  });

  it("excludes pending and invalid for direction 'out', even when minAmount is 0", () => {
    const result = filterTransactions(ALL, 0, DirectionFilter.Out);
    expect(result).toEqual([settledOut80, settledOut10]);
  });

  it("composes the direction and amount filters independently", () => {
    const result = filterTransactions(ALL, 30, DirectionFilter.In);
    expect(result).toEqual([settledIn50]);
  });

  it("returns an empty list, not an error, when no settled transaction matches", () => {
    expect(filterTransactions(ALL, 1000, DirectionFilter.In)).toEqual([]);
  });
});
