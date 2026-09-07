import { describe, expect, it } from "vitest";
import { formatCardId } from "./formatCardId";

describe("formatCardId", () => {
  it("strips dashes, uppercases, and chunks into groups of 4", () => {
    expect(formatCardId("lkmfkl-mlfkm-dlkfm")).toBe("LKMF KLML FKMD LKFM");
  });

  it("handles a length that isn't a multiple of 4 -- last chunk is shorter", () => {
    expect(formatCardId("abc-de")).toBe("ABCD E");
  });

  it("leaves already-uppercase, dash-free input unaffected beyond chunking", () => {
    expect(formatCardId("ABCDEFGH")).toBe("ABCD EFGH");
  });
});
