import { useState } from "react";
import { TransactionRow } from "../molecules/TransactionRow";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ACCENT_BG, ACCENT_TEXT } from "../../classNames";
import type { Card, Transaction } from "../../adapters/types";

export type TransactionListProps = {
  card: Card;
  filteredTransactions: readonly Transaction[];
};

const FADE_IN_VARIANTS = ["animate-fade-in", "animate-fade-in-alt"] as const;

export const TransactionList = ({ card, filteredTransactions }: TransactionListProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rowsKey = filteredTransactions.map((transaction) => transaction.key).join(",");

  const [previousRowsKey, setPreviousRowsKey] = useState(rowsKey);
  const [fadeVariant, setFadeVariant] = useState(0);
  if (rowsKey !== previousRowsKey) {
    setPreviousRowsKey(rowsKey);
    setFadeVariant((variant) => 1 - variant);
  }

  return (
    <section aria-label={`Transactions for ${card.name}`} className="overflow-hidden rounded-card border border-line">
      <div className={`flex items-center justify-between p-s-4 ${ACCENT_BG[card.accent]} ${ACCENT_TEXT}`}>
        <h2 className="text-h2 font-semibold">Recent activity · {card.name}</h2>
        <p className="text-meta">
          {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? "" : "s"}
        </p>
      </div>
      <ul
        aria-live="polite"
        className={`divide-y divide-line bg-surface ${prefersReducedMotion ? "" : FADE_IN_VARIANTS[fadeVariant]}`}
      >
        {filteredTransactions.length === 0 ? (
          <li className="p-s-4 text-row text-ink-muted">No transactions match your filters.</li>
        ) : (
          filteredTransactions.map((transaction) => <TransactionRow key={transaction.key} transaction={transaction} />)
        )}
      </ul>
    </section>
  );
};
