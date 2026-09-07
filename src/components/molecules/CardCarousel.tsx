import { useEffect, useRef } from "react";
import { CardTile } from "./CardTile";
import type { Card, CardId } from "../../adapters/types";

export type CardCarouselProps = {
  cards: Card[];
  selectedCardId: CardId | undefined;
  onSelect: (id: CardId) => void;
};

const SETTLED_THRESHOLD = 0.6;

export const CardCarousel = ({ cards, selectedCardId, onSelect }: CardCarouselProps) => {
  const containerRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const settledEntry = entries.find((entry) => entry.isIntersecting);
        const cardId = settledEntry?.target.getAttribute("data-card-id");
        if (cardId) {
          onSelect(cardId);
        }
      },
      { root: container, threshold: SETTLED_THRESHOLD }
    );

    container.querySelectorAll("[data-card-id]").forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [cards, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !selectedCardId) {
      return;
    }

    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-card-id]"));
    const selectedSlide = slides.find((slide) => slide.dataset.cardId === selectedCardId);
    selectedSlide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedCardId]);

  return (
    <fieldset
      ref={containerRef}
      className="no-scrollbar m-0 flex snap-x snap-mandatory gap-s-3 overflow-x-auto border-0 p-0 px-s-2 py-s-3 md:hidden"
    >
      <legend className="sr-only">Select a card</legend>
      {cards.map((card) => (
        <div
          key={card.id}
          data-card-id={card.id}
          className="w-[90%] flex-none snap-center first:-ml-s-2 last:-mr-s-2"
        >
          <CardTile card={card} selected={card.id === selectedCardId} onSelect={onSelect} />
        </div>
      ))}
    </fieldset>
  );
};
