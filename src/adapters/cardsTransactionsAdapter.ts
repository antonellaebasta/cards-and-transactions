import { assignTransactionKeys } from "./assignTransactionKeys";
import { classifyAmount } from "./classifyAmount";
import { resolveCardAccent } from "./cardAccent";
import { TransactionDirection, TransactionStatus, type Card, type CardId, type Transaction } from "./types";
import type { RawCard, RawTransactionsByCardId } from "../api/types";

export const getCards = (raw: readonly RawCard[]): Card[] =>
  raw.map((card) => ({
    id: card.id,
    name: card.description,
    accent: resolveCardAccent(card.description),
  }));

export const getTransactionsForCard = (raw: RawTransactionsByCardId, cardId: CardId): Transaction[] => {
  const rawTransactions = raw[cardId] ?? [];
  const keyedTransactions = assignTransactionKeys(rawTransactions);

  return keyedTransactions.map((transaction): Transaction => {
    const classification = classifyAmount(transaction.amount);

    switch (classification.status) {
      case TransactionStatus.Settled:
        return {
          status: TransactionStatus.Settled,
          key: transaction.key,
          id: transaction.id,
          amount: classification.amount,
          direction: classification.amount >= 0 ? TransactionDirection.In : TransactionDirection.Out,
          description: transaction.description,
        };
      case TransactionStatus.Pending:
        return {
          status: TransactionStatus.Pending,
          key: transaction.key,
          id: transaction.id,
          description: transaction.description,
        };
      case TransactionStatus.Invalid:
        return {
          status: TransactionStatus.Invalid,
          key: transaction.key,
          id: transaction.id,
          description: transaction.description,
          rawAmount: classification.rawAmount,
        };
      default: {
        const exhaustiveCheck: never = classification;
        return exhaustiveCheck;
      }
    }
  });
};

export const getTransactionsByCardId = (raw: RawTransactionsByCardId): Record<CardId, Transaction[]> =>
  Object.fromEntries(Object.keys(raw).map((cardId) => [cardId, getTransactionsForCard(raw, cardId)]));
