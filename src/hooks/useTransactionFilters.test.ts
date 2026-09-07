import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTransactionFilters } from "./useTransactionFilters";
import { DirectionFilter } from "../utils/filterTransactions";
import { TransactionDirection, TransactionStatus, type Transaction } from "../adapters/types";

const cardATransactions: Transaction[] = [
  { status: TransactionStatus.Settled, key: "a1", id: "a1", amount: 50, direction: TransactionDirection.In, description: "d" },
];
const cardBTransactions: Transaction[] = [
  { status: TransactionStatus.Settled, key: "b1", id: "b1", amount: -20, direction: TransactionDirection.Out, description: "d" },
];

describe("useTransactionFilters", () => {
  it("defaults to minAmount 0, direction all, and no filtering applied", () => {
    const { result } = renderHook(() => useTransactionFilters("card-a", cardATransactions));
    expect(result.current.minAmount).toBe(0);
    expect(result.current.direction).toBe(DirectionFilter.All);
    expect(result.current.filteredTransactions).toEqual(cardATransactions);
  });

  it("actually filters the list when setMinAmount/setDirection are called", () => {
    const { result } = renderHook(() => useTransactionFilters("card-a", cardATransactions));
    act(() => result.current.setDirection(DirectionFilter.Out));
    expect(result.current.filteredTransactions).toEqual([]);
  });

  it("resets both filters and swaps the list, in the same update, when the selected card switches", () => {
    const { result, rerender } = renderHook(
      ({ cardId, transactions }) => useTransactionFilters(cardId, transactions),
      { initialProps: { cardId: "card-a", transactions: cardATransactions } }
    );

    act(() => {
      result.current.setMinAmount(100);
      result.current.setDirection(DirectionFilter.In);
    });
    expect(result.current.filteredTransactions).toEqual([]);

    rerender({ cardId: "card-b", transactions: cardBTransactions });

    expect(result.current.minAmount).toBe(0);
    expect(result.current.direction).toBe(DirectionFilter.All);
    expect(result.current.filteredTransactions).toEqual(cardBTransactions);
  });
});
