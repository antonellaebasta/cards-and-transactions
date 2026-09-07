import { render, screen } from "../../testUtils/render";
import { describe, expect, it } from "vitest";
import { BalanceSummary, type BalanceSummaryProps } from "./BalanceSummary";

const DEFAULT_PROPS: BalanceSummaryProps = { cardName: "Private Card", balance: 12904.18, pendingCount: 0, unavailableCount: 0 };

const renderSummary = (overrides: Partial<BalanceSummaryProps> = {}) => render(<BalanceSummary {...DEFAULT_PROPS} {...overrides} />);

describe("BalanceSummary", () => {
  it("renders the card-scoped label and the balance in de-DE currency format", () => {
    renderSummary();
    expect(screen.getByText("Current balance · Private Card")).toBeInTheDocument();
    expect(screen.getByText("12.904,18 €")).toBeInTheDocument();
  });

  it("renders a badge for each nonzero count, with the count in its label", () => {
    renderSummary({ pendingCount: 2, unavailableCount: 1 });
    expect(screen.getByText("2 pending")).toBeInTheDocument();
    expect(screen.getByText("1 unavailable")).toBeInTheDocument();
  });

  it("renders no badges at all when both counts are 0, avoiding '0 pending' noise", () => {
    const { container } = renderSummary({ balance: 0 });
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders only the nonzero count's badge when the other is 0", () => {
    renderSummary({ cardName: "Business Card", balance: 500, unavailableCount: 3 });
    expect(screen.queryByText(/pending/)).not.toBeInTheDocument();
    expect(screen.getByText("3 unavailable")).toBeInTheDocument();
  });
});
