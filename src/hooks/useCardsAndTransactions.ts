import { useQuery } from "@tanstack/react-query";
import { fetchCards, fetchTransactionsByCardId } from "../api/api";
import { getCards, getTransactionsByCardId } from "../adapters/cardsTransactionsAdapter";
import type { Card, CardId, Transaction } from "../adapters/types";

export const LoadStatus = {
  Loading: "loading",
  Success: "success",
  Error: "error",
} as const;
export type LoadStatus = (typeof LoadStatus)[keyof typeof LoadStatus];

export type CardsAndTransactionsState =
  | { status: typeof LoadStatus.Loading }
  | { status: typeof LoadStatus.Success; cards: Card[]; transactionsByCardId: Record<CardId, Transaction[]> }
  | { status: typeof LoadStatus.Error };

const fetchNormalizedCardsAndTransactions = async () => {
  const [rawCards, rawTransactionsByCardId] = await Promise.all([fetchCards(), fetchTransactionsByCardId()]);
  return {
    cards: getCards(rawCards),
    transactionsByCardId: getTransactionsByCardId(rawTransactionsByCardId),
  };
};

export const useCardsAndTransactions = (): CardsAndTransactionsState & { retry: () => void } => {
  const query = useQuery({
    queryKey: ["cardsAndTransactions"],
    queryFn: fetchNormalizedCardsAndTransactions,
  });

  const retry = () => {
    void query.refetch();
  };

  if (query.status === "pending") {
    return { status: LoadStatus.Loading, retry };
  }
  if (query.status === "error") {
    return { status: LoadStatus.Error, retry };
  }
  return { status: LoadStatus.Success, cards: query.data.cards, transactionsByCardId: query.data.transactionsByCardId, retry };
};
