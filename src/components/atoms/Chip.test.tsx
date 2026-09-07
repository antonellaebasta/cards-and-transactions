import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("reflects the active state with aria-pressed true", () => {
    render(<Chip label="All" active onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
  });

  it("reflects the inactive state with aria-pressed false", () => {
    render(<Chip label="Out" active={false} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Out" })).toHaveAttribute("aria-pressed", "false");
  });

  it("is a native button -- reachable by Tab and operable via click without extra wiring", () => {
    render(<Chip label="In" active={false} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "In" }).tagName).toBe("BUTTON");
  });

  it("calls onSelect when activated", () => {
    const onSelect = vi.fn();
    render(<Chip label="Out" active={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Out" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
