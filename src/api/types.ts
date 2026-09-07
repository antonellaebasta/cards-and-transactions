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
