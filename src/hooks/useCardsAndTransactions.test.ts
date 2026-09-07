import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoadStatus, useCardsAndTransactions } from "./useCardsAndTransactions";
import { fetchCards, fetchTransactionsByCardId } from "../api/api";
import { createQueryClientWrapper } from "../testUtils/render";

vi.mock("../api/api", () => ({ fetchCards: vi.fn(), fetchTransactionsByCardId: vi.fn() }));

const FAKE_RAW_CARDS = [{ id: "a", description: "Private Card" }];
const FAKE_RAW_TRANSACTIONS = { a: [{ id: "t1", amount: 10, description: "Coffee" }] };

describe("useCardsAndTransactions", () => {
  beforeEach(() => {
    vi.mocked(fetchCards).mockReset().mockResolvedValue(FAKE_RAW_CARDS);
    vi.mocked(fetchTransactionsByCardId).mockReset().mockResolvedValue(FAKE_RAW_TRANSACTIONS);
  });

  it("resolves to success with the real adapter's normalized output of the fetched raw data", async () => {
    const { result } = renderHook(() => useCardsAndTransactions(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.status).toBe(LoadStatus.Success));

    if (result.current.status === LoadStatus.Success) {
      expect(result.current.cards).toEqual([{ id: "a", name: "Private Card", accent: "private" }]);
      expect(result.current.transactionsByCardId.a).toHaveLength(1);
      expect(result.current.transactionsByCardId.a[0].description).toBe("Coffee");
    }
  });

  it("puts the hook into an error state when the api layer rejects, rather than throwing", async () => {
    vi.mocked(fetchCards).mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useCardsAndTransactions(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.status).toBe(LoadStatus.Error));
  });

  it("retry re-attempts the fetch and can recover from error to success", async () => {
    vi.mocked(fetchCards).mockRejectedValueOnce(new Error("network down"));

    const { result } = renderHook(() => useCardsAndTransactions(), { wrapper: createQueryClientWrapper() });
    await waitFor(() => expect(result.current.status).toBe(LoadStatus.Error));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe(LoadStatus.Success));
  });
});
