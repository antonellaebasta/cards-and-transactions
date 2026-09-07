import { describe, expect, it } from "vitest";
import { getCards, getTransactionsByCardId, getTransactionsForCard } from "./cardsTransactionsAdapter";
import rawCards from "../data/cards.json";
import rawTransactionsByCardId from "../data/transactions.json";
import { CardAccent, TransactionDirection, TransactionStatus } from "./types";
import type { RawCard, RawTransactionsByCardId } from "../api/types";

const CARDS = rawCards as RawCard[];
const TRANSACTIONS = rawTransactionsByCardId as RawTransactionsByCardId;
const PRIVATE_CARD_ID = "lkmfkl-mlfkm-dlkfm";
const BUSINESS_CARD_ID = "elek-n3lk-4m3lk4";

describe("getCards", () => {
  it("normalizes the real cards.json fixture, with no raw field leaking through", () => {
    const cards = getCards(CARDS);

    expect(cards).toEqual([
      { id: PRIVATE_CARD_ID, name: "Private Card", accent: CardAccent.Private },
      { id: BUSINESS_CARD_ID, name: "Business Card", accent: CardAccent.Business },
    ]);
    expect(cards.every((card) => !("description" in card))).toBe(true);
  });
});

describe("getTransactionsForCard", () => {
  it("returns an empty list for an unknown card id, rather than throwing", () => {
    expect(getTransactionsForCard(TRANSACTIONS, "does-not-exist")).toEqual([]);
  });

  it("returns all 5 of Private Card's transactions, not just the valid ones", () => {
    expect(getTransactionsForCard(TRANSACTIONS, PRIVATE_CARD_ID)).toHaveLength(5);
  });

  it("normalizes Private Card's first transaction", () => {
    const transactions = getTransactionsForCard(TRANSACTIONS, PRIVATE_CARD_ID);
    expect(transactions[0]).toEqual({
      status: TransactionStatus.Settled,
      key: "lkmlk-5kkm5-55gg-0",
      id: "lkmlk-5kkm5-55gg",
      amount: 123.88,
      direction: TransactionDirection.In,
      description: "Food",
    });
  });

  // The duplicate id ("43mm3-lkm4-55gg") appears at indices 1 and 3 —
  // both must survive as distinct transactions with distinct keys.
  it("keeps Private Card's duplicate id as two distinct rows with distinct keys", () => {
    const transactions = getTransactionsForCard(TRANSACTIONS, PRIVATE_CARD_ID);
    const duplicateIdRows = transactions.filter((t) => t.id === "43mm3-lkm4-55gg");
    expect(duplicateIdRows).toHaveLength(2);
    expect(duplicateIdRows.map((t) => t.key)).toEqual(["43mm3-lkm4-55gg-1", "43mm3-lkm4-55gg-3"]);
    expect(duplicateIdRows.map((t) => t.description)).toEqual(["Snack", "Coffee"]);
  });

  // "48.20" (string in the raw JSON) must come out as a real number, not a string.
  it("coerces Private Card's numeric-string amount to a real number", () => {
    const transactions = getTransactionsForCard(TRANSACTIONS, PRIVATE_CARD_ID);
    const groceries = transactions.find((t) => t.description === "Groceries");
    expect(groceries).toEqual({
      status: TransactionStatus.Settled,
      key: "9dk2-lm3n-88aa-4",
      id: "9dk2-lm3n-88aa",
      amount: 48.2,
      direction: TransactionDirection.In,
      description: "Groceries",
    });
  });

  it("classifies Business Card's null amount as pending, with no amount field at all", () => {
    const transactions = getTransactionsForCard(TRANSACTIONS, BUSINESS_CARD_ID);
    const pending = transactions.find((t) => t.description === "Hotel Booking (pending)");

    expect(pending).toEqual({
      status: TransactionStatus.Pending,
      key: "77aa-bb88-cc99-4",
      id: "77aa-bb88-cc99",
      description: "Hotel Booking (pending)",
    });
    expect(pending && "amount" in pending).toBe(false);
  });
});

describe("getTransactionsByCardId", () => {
  it("converts every card's transactions in one pass, keyed by card id, matching per-card lookups", () => {
    const byCardId = getTransactionsByCardId(TRANSACTIONS);

    expect(Object.keys(byCardId).sort()).toEqual([BUSINESS_CARD_ID, PRIVATE_CARD_ID].sort());
    expect(byCardId[PRIVATE_CARD_ID]).toEqual(getTransactionsForCard(TRANSACTIONS, PRIVATE_CARD_ID));
    expect(byCardId[BUSINESS_CARD_ID]).toEqual(getTransactionsForCard(TRANSACTIONS, BUSINESS_CARD_ID));
  });

  it("returns an empty result for an empty raw map, not an error", () => {
    expect(getTransactionsByCardId({})).toEqual({});
  });
});
