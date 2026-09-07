import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { CardSelector } from "./CardSelector";
import { LoadStatus, type CardsAndTransactionsState } from "../../hooks/useCardsAndTransactions";
import { CardAccent } from "../../adapters/types";

const CARDS_STATE: CardsAndTransactionsState = {
  status: LoadStatus.Success,
  cards: [
    { id: "card-a", name: "Private Card", accent: CardAccent.Private },
    { id: "card-b", name: "Business Card", accent: CardAccent.Business },
  ],
  transactionsByCardId: {},
};

describe("CardSelector", () => {
  it("announces its loading state to assistive tech and renders no card tiles yet", () => {
    render(
      <CardSelector cardsState={{ status: LoadStatus.Loading }} selectedCardId={undefined} onSelect={() => {}} onRetry={() => {}} />
    );
    expect(screen.getByRole("status", { name: "Loading cards" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows an alert role and a retry button in its error state", () => {
    const onRetry = vi.fn();
    render(<CardSelector cardsState={{ status: LoadStatus.Error }} selectedCardId={undefined} onSelect={() => {}} onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load your cards.");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  // Success renders both the desktop grid and the mobile carousel (CSS
  // toggles which is visible), so every card appears twice in the DOM.
  it("renders every card in both the desktop grid and the carousel once loaded", () => {
    render(<CardSelector cardsState={CARDS_STATE} selectedCardId="card-a" onSelect={() => {}} onRetry={() => {}} />);
    expect(screen.getAllByText("Private Card")).toHaveLength(2);
    expect(screen.getAllByText("Business Card")).toHaveLength(2);
  });

  it("marks the selected card's tile as pressed in both the grid and the carousel", () => {
    render(<CardSelector cardsState={CARDS_STATE} selectedCardId="card-b" onSelect={() => {}} onRetry={() => {}} />);
    for (const button of screen.getAllByRole("button", { name: /Private Card/ })) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
    for (const button of screen.getAllByRole("button", { name: /Business Card/ })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
  });

  it("clicking a card tile (in either variant) reports that card's id", () => {
    const onSelect = vi.fn();
    render(<CardSelector cardsState={CARDS_STATE} selectedCardId="card-a" onSelect={onSelect} onRetry={() => {}} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Business Card/ })[0]);
    expect(onSelect).toHaveBeenCalledWith("card-b");
  });

  it("the mobile carousel is wired with the same cards and selection", () => {
    render(<CardSelector cardsState={CARDS_STATE} selectedCardId="card-a" onSelect={() => {}} onRetry={() => {}} />);
    const carousel = screen.getByRole("group", { name: "Select a card" });
    expect(carousel).toBeInTheDocument();
  });
});
