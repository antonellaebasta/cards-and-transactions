import { fireEvent, render, screen } from "../testUtils/render";
import { mockReducedMotion } from "../testUtils/mockMatchMedia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Overview } from "./Overview";

// Every card renders twice (desktop grid + mobile carousel, toggled by CSS
// -- see CardSelector), so text/button queries here use the *All* variants
// and act on the first match rather than assuming a single element.

describe("Overview", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading skeleton for the cards region before the simulated fetch resolves", async () => {
    render(<Overview />);
    expect(screen.getByRole("status", { name: "Loading cards" })).toBeInTheDocument();
    // Drain the pending load within act() -- otherwise its setState fires
    // after the test has already finished, outside React's test harness.
    await screen.findAllByText("Private Card");
  });

  it("runs the full happy path: load, default selection, filter, switch card", async () => {
    render(<Overview />);

    await screen.findAllByText("Private Card");
    for (const button of screen.getAllByRole("button", { name: /Private Card/ })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
    expect(screen.getByText("Current balance · Private Card")).toBeInTheDocument();
    expect(screen.getByLabelText("Minimum amount")).toHaveValue(0);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");

    expect(screen.getByText("+48,20 €")).toBeInTheDocument();

    // Filter by amount: only rows worth >= 100 remain (Private Card has none this large -> empty state).
    fireEvent.change(screen.getByLabelText("Minimum amount"), { target: { value: "1000" } });
    expect(screen.getByText("No transactions match your filters.")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Business Card/ })[0]);

    expect(screen.getByLabelText("Minimum amount")).toHaveValue(0);
    expect(screen.getByText("Recent activity · Business Card")).toBeInTheDocument();
    expect(screen.getByText("T-Shirt")).toBeInTheDocument();

    expect(screen.getByText("Hotel Booking (pending)")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Out" }));
    expect(screen.getByText("Refund for Smart Phone")).toBeInTheDocument();
    expect(screen.queryByText("T-Shirt")).not.toBeInTheDocument();
  });

  it("the selected card's checkmark badge always fades in, regardless of reduced-motion preference", async () => {
    mockReducedMotion(true);
    render(<Overview />);
    await screen.findAllByText("Private Card");

    for (const button of screen.getAllByRole("button", { name: /Private Card/ })) {
      expect(button.querySelector("span")).toHaveClass("animate-fade-in");
    }
  });
});
