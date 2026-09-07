import { AmountFilterField } from "../molecules/AmountFilterField";
import { DirectionFilterControl } from "../molecules/DirectionFilterControl";
import type { DirectionFilter } from "../../utils/filterTransactions";

export type FilterBarProps = {
  minAmount: number;
  onMinAmountChange: (value: number) => void;
  direction: DirectionFilter;
  onDirectionChange: (value: DirectionFilter) => void;
};

export const FilterBar = ({ minAmount, onMinAmountChange, direction, onDirectionChange }: FilterBarProps) => (
  <div className="flex flex-col gap-s-4 rounded-card border border-line bg-surface p-s-5 sm:flex-row sm:items-center sm:justify-between sm:gap-s-6">
    <div className="min-w-0 flex-1">
      <AmountFilterField value={minAmount} onChange={onMinAmountChange} />
    </div>
    <DirectionFilterControl value={direction} onChange={onDirectionChange} />
  </div>
);
