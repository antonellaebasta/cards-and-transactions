import { TransactionStatus, type Transaction } from "../adapters/types";

type TransactionSummary = {
  balance: number;
  pendingCount: number;
  unavailableCount: number;
};

export const summarizeTransactions = (transactions: readonly Transaction[]): TransactionSummary =>
  transactions.reduce<TransactionSummary>(
    (summary, transaction) => {
      switch (transaction.status) {
        case TransactionStatus.Settled:
          return { ...summary, balance: summary.balance + transaction.amount };
        case TransactionStatus.Pending:
          return { ...summary, pendingCount: summary.pendingCount + 1 };
        case TransactionStatus.Invalid:
          return { ...summary, unavailableCount: summary.unavailableCount + 1 };
        default: {
          const exhaustiveCheck: never = transaction;
          return exhaustiveCheck;
        }
      }
    },
    { balance: 0, pendingCount: 0, unavailableCount: 0 }
  );
