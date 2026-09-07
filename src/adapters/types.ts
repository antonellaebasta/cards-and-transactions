export type RawCard = {
  id: string;
  description: string;
};

export type RawTransaction = {
  id: string;
  amount: number | string | null;
  description: string;
};

export type RawTransactionsByCardId = Record<string, RawTransaction[]>;

export type CardId = string;

export const CardAccent = {
  Private: "private",
  Business: "business",
} as const;
export type CardAccent = (typeof CardAccent)[keyof typeof CardAccent];

export type Card = {
  id: CardId;
  name: string;
  accent: CardAccent;
};

export const TransactionDirection = {
  In: "in",
  Out: "out",
} as const;
export type TransactionDirection = (typeof TransactionDirection)[keyof typeof TransactionDirection];

export const TransactionStatus = {
  Settled: "settled",
  Pending: "pending",
  Invalid: "invalid",
} as const;
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export type SettledTransaction = {
  status: typeof TransactionStatus.Settled;
  key: string;
  id: string;
  amount: number;
  direction: TransactionDirection;
  description: string;
};

export type PendingTransaction = {
  status: typeof TransactionStatus.Pending;
  key: string;
  id: string;
  description: string;
};

export type InvalidTransaction = {
  status: typeof TransactionStatus.Invalid;
  key: string;
  id: string;
  description: string;
  rawAmount: string;
};

export type Transaction = SettledTransaction | PendingTransaction | InvalidTransaction;
