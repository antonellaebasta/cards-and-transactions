import { render, screen } from "../../testUtils/render";
import { mockReducedMotion } from "../../testUtils/mockMatchMedia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransactionList } from "./TransactionList";
import { CardAccent, TransactionDirection, TransactionStatus, type Card, type Transaction } from "../../adapters/types";

const PRIVATE_CARD: Card = { id: "card-a", name: "Private Card", accent: CardAccent.Private };

const TRANSACTIONS: Transaction[] = [
  { status: TransactionStatus.Settled, key: "k1", id: "t1", amount: 100, direction: TransactionDirection.In, description: "Payroll" },
  { status: TransactionStatus.Settled, key: "k2", id: "t2", amount: -40, direction: TransactionDirection.Out, description: "Rent" },
  { status: TransactionStatus.Pending, key: "k3", id: "t3", description: "Hotel Booking" },
];

describe("TransactionList", () => {
  it("renders the accent-colored header with the card name and the filtered count", () => {
    render(<TransactionList card={PRIVATE_CARD} filteredTransactions={TRANSACTIONS} />);
    expect(screen.getByText("Recent activity · Private Card")).toBeInTheDocument();
    expect(screen.getByText("3 transactions")).toBeInTheDocument();
  });

  it("renders one row per filtered transaction, and the header count tracks the filter, not the card's full total", () => {
    const onlyPayroll = [TRANSACTIONS[0]];
    render(<TransactionList card={PRIVATE_CARD} filteredTransactions={onlyPayroll} />);
    expect(screen.getByText("Payroll")).toBeInTheDocument();
    expect(screen.queryByText("Rent")).not.toBeInTheDocument();
    expect(screen.getByText("1 transaction")).toBeInTheDocument();
  });

  it("shows an empty-state message, not a blank list, when the filtered list is empty", () => {
    render(<TransactionList card={PRIVATE_CARD} filteredTransactions={[]} />);
    expect(screen.getByText("No transactions match your filters.")).toBeInTheDocument();
  });

  it("the transaction list region is a live region for assistive tech", () => {
    render(<TransactionList card={PRIVATE_CARD} filteredTransactions={TRANSACTIONS} />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-live", "polite");
  });

  describe("reduced motion", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("gives the row list its fade-in animation class when there's no reduced-motion preference", () => {
      mockReducedMotion(false);
      render(<TransactionList card={PRIVATE_CARD} filteredTransactions={TRANSACTIONS} />);
      expect(screen.getByRole("list")).toHaveClass("animate-fade-in");
    });

    it("gives the row list no animation class at all when reduced motion is preferred, not just a shorter duration", () => {
      mockReducedMotion(true);
      render(<TransactionList card={PRIVATE_CARD} filteredTransactions={TRANSACTIONS} />);
      expect(screen.getByRole("list")).not.toHaveClass("animate-fade-in");
    });
  });

  it("a filter change replays the fade by alternating animation classes, without unmounting surviving rows", () => {
    const { rerender } = render(
      <TransactionList card={PRIVATE_CARD} filteredTransactions={TRANSACTIONS} />
    );
    const payrollRow = screen.getByText("Payroll");
    expect(screen.getByRole("list")).toHaveClass("animate-fade-in");

    rerender(<TransactionList card={PRIVATE_CARD} filteredTransactions={[TRANSACTIONS[0]]} />);
    expect(screen.getByRole("list")).toHaveClass("animate-fade-in-alt");
    expect(screen.getByText("Payroll")).toBe(payrollRow);
  });
});
