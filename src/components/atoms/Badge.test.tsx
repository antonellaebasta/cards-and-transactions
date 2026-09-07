import { render, screen } from "../../testUtils/render";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";
import { BadgeKind } from "./BadgeKind";

describe("Badge", () => {
  it("renders a pending badge with a hidden icon (assistive tech relies on the label) and the given label", () => {
    const { container } = render(<Badge kind={BadgeKind.Pending} label="Pending" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders an unavailable badge with a hidden icon and the given label", () => {
    const { container } = render(<Badge kind={BadgeKind.Unavailable} label="Unavailable" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("renders a different icon per kind, not the same one for both", () => {
    const { container: pending } = render(<Badge kind={BadgeKind.Pending} label="Pending" />);
    const { container: unavailable } = render(<Badge kind={BadgeKind.Unavailable} label="Unavailable" />);
    expect(pending.querySelector("svg")?.innerHTML).not.toBe(unavailable.querySelector("svg")?.innerHTML);
  });

  it("supports an aggregate count label without the atom hardcoding pluralization/capitalization rules", () => {
    render(<Badge kind={BadgeKind.Unavailable} label="1 unavailable" />);
    expect(screen.getByText("1 unavailable")).toBeInTheDocument();
  });
});
