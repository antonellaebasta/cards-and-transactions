import { describe, expect, it } from "vitest";
import { fetchCards, fetchTransactionsByCardId } from "./api";

describe("fetchCards", () => {
  it("resolves asynchronously (shaped like a real request) with the raw card list", async () => {
    const result = fetchCards();
    expect(result).toBeInstanceOf(Promise);

    const cards = await result;
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0]).toHaveProperty("id");
    expect(cards[0]).toHaveProperty("description");
  });
});

describe("fetchTransactionsByCardId", () => {
  it("resolves asynchronously (shaped like a real request) with the raw transactions map", async () => {
    const result = fetchTransactionsByCardId();
    expect(result).toBeInstanceOf(Promise);

    const transactionsByCardId = await result;
    expect(Object.keys(transactionsByCardId).length).toBeGreaterThan(0);
  });
});
