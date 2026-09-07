import { useState } from "react";
import { DirectionFilter, filterTransactions } from "../utils/filterTransactions";
import type { CardId, Transaction } from "../adapters/types";

export const useTransactionFilters = (selectedCardId: CardId | undefined, transactions: readonly Transaction[]) => {
  const [minAmount, setMinAmount] = useState(0);
  const [direction, setDirection] = useState<DirectionFilter>(DirectionFilter.All);
  const [previousCardId, setPreviousCardId] = useState(selectedCardId);

  // Local overrides for this render only: setMinAmount/setDirection below
  // won't be visible until the next render, but filteredTransactions still
  // needs the reset values right now to avoid filtering the new card's
  // transactions by the old card's filter for one extra pass.
  let effectiveMinAmount = minAmount;
  let effectiveDirection = direction;
  if (selectedCardId !== previousCardId) {
    setPreviousCardId(selectedCardId);
    effectiveMinAmount = 0;
    effectiveDirection = DirectionFilter.All;
    setMinAmount(effectiveMinAmount);
    setDirection(effectiveDirection);
  }

  const filteredTransactions = filterTransactions(transactions, effectiveMinAmount, effectiveDirection);

  return {
    minAmount: effectiveMinAmount,
    setMinAmount,
    direction: effectiveDirection,
    setDirection,
    filteredTransactions,
  };
};
