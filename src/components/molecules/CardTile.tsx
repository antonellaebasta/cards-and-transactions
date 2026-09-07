import { ACCENT_BG, ACCENT_TEXT, FOCUS_RING } from "../../classNames";
import { Icon } from "../atoms/Icon";
import { IconName } from "../atoms/IconName";
import type { Card, CardId } from "../../adapters/types";
import { formatCardId } from "../../utils/formatCardId";

export type CardTileProps = {
  card: Card;
  selected: boolean;
  onSelect: (id: CardId) => void;
};

export const CardTile = ({ card, selected, onSelect }: CardTileProps) => {
  const className = [
    "relative w-full flex-1 cursor-pointer rounded-card p-s-5 text-left hover:brightness-95",
    ACCENT_BG[card.accent],
    ACCENT_TEXT,
    FOCUS_RING,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" aria-pressed={selected} onClick={() => onSelect(card.id)} className={className}>
      {selected && (
        <span
          className={`absolute -right-s-3 -top-s-3 animate-fade-in rounded-full p-s-2 text-surface ring-2 ring-surface ${ACCENT_BG[card.accent]}`}
        >
          <Icon name={IconName.Check} className="block text-h2" />
        </span>
      )}
      <p className="text-meta font-semibold tracking-wide">CARD ID</p>
      <p className="text-card-id font-medium">{formatCardId(card.id)}</p>
      <p className="mt-s-1 text-label font-semibold">{card.name}</p>
    </button>
  );
};
