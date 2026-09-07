import { fireEvent, render, screen } from "../../testUtils/render";
import { describe, expect, it, vi } from "vitest";
import { AmountFilterField } from "./AmountFilterField";

const renderField = (value: number, onChange: (value: number) => void = () => {}) =>
  render(<AmountFilterField value={value} onChange={onChange} />);

const changeAmountInput = (value: string) => fireEvent.change(screen.getByLabelText("Minimum amount"), { target: { value } });

describe("AmountFilterField", () => {
  it("associates the label with the input via htmlFor/id", () => {
    renderField(0);
    expect(screen.getByLabelText("Minimum amount")).toBeInTheDocument();
  });

  it("echoes the current value in the helper text, in de-DE currency format", () => {
    renderField(50);
    expect(screen.getByText("Shows transactions of 50,00 € or more")).toBeInTheDocument();
  });

  it("calls onChange with the parsed number when typing a valid amount", () => {
    const onChange = vi.fn();
    renderField(0, onChange);
    changeAmountInput("75");
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it("clamps a negative amount to 0, shows an inline note, and does not hard-block the field", () => {
    const onChange = vi.fn();
    renderField(0, onChange);
    changeAmountInput("-10");
    expect(onChange).toHaveBeenCalledWith(0);
    expect(screen.getByRole("status")).toHaveTextContent(/can't be negative/i);
  });

  it("treats clearing the field back to empty as 0, not an error", () => {
    const onChange = vi.fn();
    renderField(50, onChange);
    changeAmountInput("");
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
