import { CardTile } from "../molecules/CardTile";
import { CardCarousel } from "../molecules/CardCarousel";
import { ErrorNotice } from "../molecules/ErrorNotice";
import { LoadStatus, type CardsAndTransactionsState } from "../../hooks/useCardsAndTransactions";
import type { CardId } from "../../adapters/types";

export type CardSelectorProps = {
  cardsState: CardsAndTransactionsState;
  selectedCardId: CardId | undefined;
  onSelect: (id: CardId) => void;
  onRetry: () => void;
};

export const CardSelector = ({ cardsState, selectedCardId, onSelect, onRetry }: CardSelectorProps) => {
  if (cardsState.status === LoadStatus.Loading) {
    return (
      <div role="status" aria-label="Loading cards" className="flex gap-s-6">
        <div className="h-card-tile w-card-tile rounded-card bg-disabled motion-safe:animate-pulse" />
        <div className="h-card-tile w-card-tile rounded-card bg-disabled motion-safe:animate-pulse" />
      </div>
    );
  }

  if (cardsState.status === LoadStatus.Error) {
    return <ErrorNotice message="Couldn't load your cards." onRetry={onRetry} />;
  }

  return (
    <>
      <div className="hidden gap-s-6 md:flex">
        {cardsState.cards.map((card) => (
          <CardTile key={card.id} card={card} selected={card.id === selectedCardId} onSelect={onSelect} />
        ))}
      </div>
      <CardCarousel cards={cardsState.cards} selectedCardId={selectedCardId} onSelect={onSelect} />
    </>
  );
};
