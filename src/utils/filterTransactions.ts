import { TransactionStatus, type Transaction } from "../adapters/types";

export const DirectionFilter = {
  All: "all",
  In: "in",
  Out: "out",
} as const;
export type DirectionFilter = (typeof DirectionFilter)[keyof typeof DirectionFilter];

export const filterTransactions = (
  transactions: readonly Transaction[],
  minAmount: number,
  direction: DirectionFilter
): Transaction[] =>
  transactions.filter((transaction) => {
    if (transaction.status === TransactionStatus.Settled) {
      if (Math.abs(transaction.amount) < minAmount) {
        return false;
      }
      return direction === DirectionFilter.All || transaction.direction === direction;
    }

    if (direction !== DirectionFilter.All) {
      return false;
    }

    if (transaction.status === TransactionStatus.Pending && minAmount > 0) {
      return false;
    }

    return true;
  });
