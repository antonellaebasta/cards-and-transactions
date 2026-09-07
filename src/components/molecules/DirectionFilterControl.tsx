import type { ReactNode } from "react";
import { Chip } from "../atoms/Chip";
import { Icon } from "../atoms/Icon";
import { IconName } from "../atoms/IconName";
import { DirectionFilter } from "../../utils/filterTransactions";

export type DirectionFilterControlProps = {
  value: DirectionFilter;
  onChange: (value: DirectionFilter) => void;
};

const OPTIONS: { value: DirectionFilter; label: string; icon: ReactNode }[] = [
  { value: DirectionFilter.All, label: "All", icon: <span aria-hidden="true" className="h-s-1 w-s-1 rounded-full bg-current" /> },
  { value: DirectionFilter.In, label: "In", icon: <Icon name={IconName.ArrowDownward} /> },
  { value: DirectionFilter.Out, label: "Out", icon: <Icon name={IconName.ArrowUpward} /> },
];

export const DirectionFilterControl = ({ value, onChange }: DirectionFilterControlProps) => (
  <fieldset className="m-0 inline-flex self-start gap-s-1 rounded-pill border-0 bg-ink p-s-1 sm:self-auto">
    <legend className="sr-only">Filter by direction</legend>
    {OPTIONS.map((option) => (
      <Chip
        key={option.value}
        label={option.label}
        icon={option.icon}
        active={value === option.value}
        onSelect={() => onChange(option.value)}
      />
    ))}
  </fieldset>
);
