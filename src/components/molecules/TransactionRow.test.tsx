import { render, screen } from "../../testUtils/render";
import { describe, expect, it } from "vitest";
import { TransactionRow } from "./TransactionRow";
import { TransactionDirection, TransactionStatus, type Transaction } from "../../adapters/types";

const renderRow = (transaction: Transaction) => render(<ul>{<TransactionRow transaction={transaction} />}</ul>);

describe("TransactionRow", () => {
  it("renders a settled credit row with its description, TX-prefixed id, and a +-signed amount", () => {
    renderRow({
      status: TransactionStatus.Settled,
      key: "k1",
      id: "8842-11",
      amount: 2400,
      direction: TransactionDirection.In,
      description: "Acme GmbH payroll",
    });

    expect(screen.getByText("Acme GmbH payroll")).toBeInTheDocument();
    expect(screen.getByText("TX 8842-11")).toBeInTheDocument();
    expect(screen.getByText("+2.400,00 €")).toBeInTheDocument();
  });

  it("renders a settled debit row with its real minus sign and no Badge icon", () => {
    const { container } = renderRow({
      status: TransactionStatus.Settled,
      key: "k2",
      id: "8842-12",
      amount: -96.12,
      direction: TransactionDirection.Out,
      description: "Rewe Markt GmbH",
    });

    expect(screen.getByText("-96,12 €")).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a Pending badge with its icon instead of an amount when pending", () => {
    const { container } = renderRow({ status: TransactionStatus.Pending, key: "k3", id: "8842-13", description: "Hotel Booking" });

    expect(screen.getByText("Hotel Booking")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders an Unavailable badge with its icon instead of an amount when invalid", () => {
    const { container } = renderRow({
      status: TransactionStatus.Invalid,
      key: "k4",
      id: "8842-14",
      description: "Corrupted row",
      rawAmount: "N/A",
    });

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
