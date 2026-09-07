import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSelectedCard } from "./useSelectedCard";
import { CardAccent, TransactionDirection, TransactionStatus, type Card, type CardId, type Transaction } from "../adapters/types";

const CARDS: Card[] = [
  { id: "card-a", name: "A", accent: CardAccent.Private },
  { id: "card-b", name: "B", accent: CardAccent.Business },
];
const TRANSACTIONS_BY_CARD_ID: Record<CardId, Transaction[]> = {
  "card-a": [
    { status: TransactionStatus.Settled, key: "t1-0", id: "t1", amount: 10, direction: TransactionDirection.In, description: "Coffee" },
  ],
  "card-b": [
    { status: TransactionStatus.Settled, key: "t2-0", id: "t2", amount: 20, direction: TransactionDirection.In, description: "Rent" },
  ],
};

describe("useSelectedCard", () => {
  it("has no selection and no transactions when there are no cards yet", () => {
    const { result } = renderHook(() => useSelectedCard([], {}));
    expect(result.current.selectedCardId).toBeUndefined();
    expect(result.current.transactions).toEqual([]);
  });

  it("auto-selects the first card once cards become available", () => {
    const { result, rerender } = renderHook(({ cards }) => useSelectedCard(cards, TRANSACTIONS_BY_CARD_ID), {
      initialProps: { cards: [] as Card[] },
    });
    expect(result.current.selectedCardId).toBeUndefined();

    rerender({ cards: CARDS });
    expect(result.current.selectedCardId).toBe("card-a");
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].description).toBe("Coffee");
  });

  it("switches the selected id and looks up that card's transactions when selectCard is called", () => {
    const { result } = renderHook(() => useSelectedCard(CARDS, TRANSACTIONS_BY_CARD_ID));

    act(() => result.current.selectCard("card-b"));

    expect(result.current.selectedCardId).toBe("card-b");
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].description).toBe("Rent");
  });

  it("returns an empty list rather than throwing when the selected id has no entry in the map", () => {
    const { result } = renderHook(() => useSelectedCard(CARDS, {}));
    expect(result.current.transactions).toEqual([]);
  });
});
