import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { DirectionFilterControl } from "./DirectionFilterControl";
import { DirectionFilter } from "../../utils/filterTransactions";

describe("DirectionFilterControl", () => {
  it("renders all three options, grouped for assistive tech", () => {
    render(<DirectionFilterControl value={DirectionFilter.All} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Filter by direction" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Out" })).toBeInTheDocument();
  });

  it("marks only the current value's chip as pressed", () => {
    render(<DirectionFilterControl value={DirectionFilter.In} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "In" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Out" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option's value", () => {
    const onChange = vi.fn();
    render(<DirectionFilterControl value={DirectionFilter.All} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Out" }));
    expect(onChange).toHaveBeenCalledWith(DirectionFilter.Out);
  });
});
