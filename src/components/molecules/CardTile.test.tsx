import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { CardTile } from "./CardTile";
import { CardAccent, type Card } from "../../adapters/types";

const PRIVATE_CARD: Card = { id: "lkmfkl-mlfkm-dlkfm", name: "Private Card", accent: CardAccent.Private };

describe("CardTile", () => {
  it("renders the card name and the id formatted like a card number", () => {
    render(<CardTile card={PRIVATE_CARD} selected={false} onSelect={() => {}} />);
    expect(screen.getByText("Private Card")).toBeInTheDocument();
    expect(screen.getByText("LKMF KLML FKMD LKFM")).toBeInTheDocument();
  });

  it("marks a selected card with aria-pressed true and renders the checkmark badge", () => {
    render(<CardTile card={PRIVATE_CARD} selected onSelect={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.querySelectorAll("svg")).toHaveLength(1);
  });

  it("marks a card that isn't selected with aria-pressed false and no checkmark badge", () => {
    render(<CardTile card={PRIVATE_CARD} selected={false} onSelect={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.querySelectorAll("svg")).toHaveLength(0);
  });

  it("is a native, keyboard-operable button that reports its own id on selection", () => {
    const onSelect = vi.fn();
    render(<CardTile card={PRIVATE_CARD} selected={false} onSelect={onSelect} />);
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith("lkmfkl-mlfkm-dlkfm");
  });
});
