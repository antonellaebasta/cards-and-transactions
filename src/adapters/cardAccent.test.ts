import { describe, expect, it } from "vitest";
import { resolveCardAccent } from "./cardAccent";
import { CardAccent } from "./types";

describe("resolveCardAccent", () => {
  it("maps 'Private Card' to the private accent", () => {
    expect(resolveCardAccent("Private Card")).toBe(CardAccent.Private);
  });

  it("maps 'Business Card' to the business accent", () => {
    expect(resolveCardAccent("Business Card")).toBe(CardAccent.Business);
  });

  it("falls back to the private accent for an unrecognized description, rather than throwing", () => {
    expect(resolveCardAccent("Student Card")).toBe(CardAccent.Private);
  });
});
