import { useState } from "react";
import type { Card, CardId, Transaction } from "../adapters/types";

export const useSelectedCard = (cards: readonly Card[], transactionsByCardId: Record<CardId, Transaction[]>) => {
  const [selectedCardId, setSelectedCardId] = useState<CardId | undefined>(undefined);

  if (selectedCardId === undefined && cards.length > 0) {
    setSelectedCardId(cards[0].id);
  }

  const transactions = selectedCardId ? (transactionsByCardId[selectedCardId] ?? []) : [];

  return { selectedCardId, selectCard: setSelectedCardId, transactions };
};
