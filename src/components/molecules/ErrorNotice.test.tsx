import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { ErrorNotice } from "./ErrorNotice";

describe("ErrorNotice", () => {
  it("renders the given message as an alert", () => {
    render(<ErrorNotice message="Couldn't load your cards." onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load your cards.");
  });

  it("calls onRetry when the retry button is activated", () => {
    const onRetry = vi.fn();
    render(<ErrorNotice message="Something broke." onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
