import { CardAccent } from "./types";

const ACCENT_BY_DESCRIPTION: Record<string, CardAccent> = {
  "Private Card": CardAccent.Private,
  "Business Card": CardAccent.Business,
};

export const resolveCardAccent = (description: string): CardAccent =>
  ACCENT_BY_DESCRIPTION[description] ?? CardAccent.Private;
