import { render } from "../../testUtils/render";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";
import { IconName } from "./IconName";

describe("Icon", () => {
  it("renders as a decorative, hidden svg", () => {
    const { container } = render(<Icon name={IconName.Check} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("each icon name renders distinct content", () => {
    const { container: check } = render(<Icon name={IconName.Check} />);
    const { container: block } = render(<Icon name={IconName.Block} />);
    expect(check.querySelector("svg")?.innerHTML).not.toBe(block.querySelector("svg")?.innerHTML);
  });

  it("accepts a className for sizing/spacing at the call site", () => {
    const { container } = render(<Icon name={IconName.ArrowUpward} className="text-warning-deep" />);
    expect(container.querySelector("svg")).toHaveClass("text-warning-deep");
  });
});
