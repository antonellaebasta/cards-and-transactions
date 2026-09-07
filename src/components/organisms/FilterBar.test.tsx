import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { FilterBar } from "./FilterBar";
import { DirectionFilter } from "../../utils/filterTransactions";

describe("FilterBar", () => {
  it("renders both the amount field and the direction control", () => {
    render(<FilterBar minAmount={0} onMinAmountChange={() => {}} direction={DirectionFilter.All} onDirectionChange={() => {}} />);
    expect(screen.getByLabelText("Minimum amount")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Filter by direction" })).toBeInTheDocument();
  });

  it("wires the amount field's onChange through", () => {
    const onMinAmountChange = vi.fn();
    render(
      <FilterBar minAmount={0} onMinAmountChange={onMinAmountChange} direction={DirectionFilter.All} onDirectionChange={() => {}} />
    );
    fireEvent.change(screen.getByLabelText("Minimum amount"), { target: { value: "30" } });
    expect(onMinAmountChange).toHaveBeenCalledWith(30);
  });

  it("wires the direction control's onChange through", () => {
    const onDirectionChange = vi.fn();
    render(
      <FilterBar minAmount={0} onMinAmountChange={() => {}} direction={DirectionFilter.All} onDirectionChange={onDirectionChange} />
    );
    fireEvent.click(screen.getByRole("button", { name: "In" }));
    expect(onDirectionChange).toHaveBeenCalledWith(DirectionFilter.In);
  });
});
