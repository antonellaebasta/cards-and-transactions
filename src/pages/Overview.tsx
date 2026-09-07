import { OverviewLayout } from "../components/templates/OverviewLayout";
import { CardSelector } from "../components/organisms/CardSelector";
import { FilterBar } from "../components/organisms/FilterBar";
import { TransactionList } from "../components/organisms/TransactionList";
import { BalanceSummary } from "../components/molecules/BalanceSummary";
import { OrganismErrorBoundary } from "../components/OrganismErrorBoundary";
import { LoadStatus, useCardsAndTransactions } from "../hooks/useCardsAndTransactions";
import { useSelectedCard } from "../hooks/useSelectedCard";
import { useTransactionFilters } from "../hooks/useTransactionFilters";
import { summarizeTransactions } from "../utils/summarizeTransactions";

const BalanceSummarySkeleton = () => (
  <div role="status" aria-label="Loading balance" className="h-skeleton-summary w-full rounded-card bg-disabled motion-safe:animate-pulse" />
);

const TransactionListSkeleton = () => (
  <div role="status" aria-label="Loading transactions" className="space-y-s-2">
    <div className="h-skeleton-row w-full rounded-field bg-disabled motion-safe:animate-pulse" />
    <div className="h-skeleton-row w-full rounded-field bg-disabled motion-safe:animate-pulse" />
  </div>
);

export const Overview = () => {
  const cardsState = useCardsAndTransactions();
  const cards = cardsState.status === LoadStatus.Success ? cardsState.cards : [];
  const transactionsByCardId = cardsState.status === LoadStatus.Success ? cardsState.transactionsByCardId : {};

  const { selectedCardId, selectCard, transactions } = useSelectedCard(cards, transactionsByCardId);
  const { minAmount, setMinAmount, direction, setDirection, filteredTransactions } = useTransactionFilters(
    selectedCardId,
    transactions
  );

  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const summary = summarizeTransactions(transactions);

  return (
    <OverviewLayout
      cardSelector={
        <OrganismErrorBoundary label="Cards">
          <CardSelector
            cardsState={cardsState}
            selectedCardId={selectedCardId}
            onSelect={selectCard}
            onRetry={cardsState.retry}
          />
        </OrganismErrorBoundary>
      }
      balanceSummary={
        selectedCard ? (
          <BalanceSummary
            cardName={selectedCard.name}
            balance={summary.balance}
            pendingCount={summary.pendingCount}
            unavailableCount={summary.unavailableCount}
          />
        ) : (
          cardsState.status === LoadStatus.Loading && <BalanceSummarySkeleton />
        )
      }
      filterBar={
        selectedCard && (
          <FilterBar
            minAmount={minAmount}
            onMinAmountChange={setMinAmount}
            direction={direction}
            onDirectionChange={setDirection}
          />
        )
      }
      transactionList={
        <OrganismErrorBoundary label="Transactions">
          {selectedCard ? (
            <TransactionList card={selectedCard} filteredTransactions={filteredTransactions} />
          ) : (
            cardsState.status === LoadStatus.Loading && <TransactionListSkeleton />
          )}
        </OrganismErrorBoundary>
      }
    />
  );
};
