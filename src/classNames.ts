import { CardAccent } from "./adapters/types";

export const ACCENT_BG: Record<CardAccent, string> = {
  [CardAccent.Private]: "bg-card-private-deep",
  [CardAccent.Business]: "bg-card-business-deep",
};

export const ACCENT_TEXT = "text-surface";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link-deep focus-visible:ring-offset-[3px]";
