import { useState, type ChangeEvent } from "react";
import { FOCUS_RING } from "../../classNames";
import { formatCurrency } from "../../utils/formatCurrency";

export type AmountFilterFieldProps = {
  value: number;
  onChange: (value: number) => void;
};

const HELPER_ID = "amount-filter-helper";
const WARNING_ID = "amount-filter-warning";

export const AmountFilterField = ({ value, onChange }: AmountFilterFieldProps) => {
  const [hasNegativeWarning, setHasNegativeWarning] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.valueAsNumber;
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;

    if (normalizedValue < 0) {
      setHasNegativeWarning(true);
      onChange(0);
      return;
    }

    setHasNegativeWarning(false);
    onChange(normalizedValue);
  };

  return (
    <div>
      <label htmlFor="amount-filter" className="mb-s-1 block text-label font-semibold text-ink-muted">
        Minimum amount
      </label>
      <div className="relative">
        <input
          id="amount-filter"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.01}
          value={value}
          onChange={handleChange}
          placeholder="0,00"
          aria-describedby={hasNegativeWarning ? `${WARNING_ID} ${HELPER_ID}` : HELPER_ID}
          className={`w-full rounded-field border-2 border-field-edge bg-surface p-s-3 pr-s-6 text-ink hover:border-ink-muted ${FOCUS_RING}`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute right-s-3 top-1/2 -translate-y-1/2 text-ink-muted">
          €
        </span>
      </div>
      {hasNegativeWarning && (
        <output id={WARNING_ID} htmlFor="amount-filter" className="mt-s-1 block text-meta text-warning-deep">
          Amount can&apos;t be negative — showing from 0,00 €
        </output>
      )}
      <p id={HELPER_ID} className="mt-s-2 text-meta text-ink-muted">
        Shows transactions of {formatCurrency(value)} or more
      </p>
    </div>
  );
};
