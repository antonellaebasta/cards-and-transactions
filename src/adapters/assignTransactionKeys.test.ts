import { describe, expect, it } from "vitest";
import { assignTransactionKeys } from "./assignTransactionKeys";

describe("assignTransactionKeys", () => {
  it("produces a unique key per item, even with a synthetic list of same-id items", () => {
    const items = [{ id: "a" }, { id: "a" }, { id: "b" }];
    const keyed = assignTransactionKeys(items);
    const keys = keyed.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(["a-0", "a-1", "b-2"]);
  });

  it("preserves the original id alongside the synthetic key", () => {
    const keyed = assignTransactionKeys([{ id: "a" }]);
    expect(keyed[0]).toEqual({ id: "a", key: "a-0" });
  });

  it("keeps every key unique even when the same id repeats three times, non-consecutively", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "a" }, { id: "c" }, { id: "a" }];
    const keyed = assignTransactionKeys(items);
    const keys = keyed.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);

    const duplicateIdEntries = keyed.filter((item) => item.id === "a");
    expect(duplicateIdEntries).toHaveLength(3);
    expect(new Set(duplicateIdEntries.map((item) => item.key)).size).toBe(3);
  });
});
