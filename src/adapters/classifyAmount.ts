import { TransactionStatus } from "./types";

export type AmountClassification =
  | { status: typeof TransactionStatus.Settled; amount: number }
  | { status: typeof TransactionStatus.Pending }
  | { status: typeof TransactionStatus.Invalid; rawAmount: string };

export const classifyAmount = (amount: unknown): AmountClassification => {
  if (amount === null) {
    return { status: TransactionStatus.Pending };
  }

  if (typeof amount === "number") {
    return Number.isFinite(amount)
      ? { status: TransactionStatus.Settled, amount: normalizeNegativeZero(amount) }
      : { status: TransactionStatus.Invalid, rawAmount: String(amount) };
  }

  if (typeof amount === "string") {
    const trimmedAmount = amount.trim();
    if (trimmedAmount === "") {
      return { status: TransactionStatus.Invalid, rawAmount: amount };
    }
    const parsedAmount = Number(trimmedAmount);
    return Number.isFinite(parsedAmount)
      ? { status: TransactionStatus.Settled, amount: normalizeNegativeZero(parsedAmount) }
      : { status: TransactionStatus.Invalid, rawAmount: amount };
  }

  return { status: TransactionStatus.Invalid, rawAmount: String(amount) };
};

const normalizeNegativeZero = (value: number): number => value + 0;
