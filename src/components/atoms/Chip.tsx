import type { ReactNode } from "react";
import { FOCUS_RING } from "../../classNames";

export type ChipProps = {
  label: string;
  icon?: ReactNode;
  active: boolean;
  onSelect: () => void;
};

export const Chip = ({ label, icon, active, onSelect }: ChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onSelect}
    className={`inline-flex cursor-pointer items-center gap-s-1 rounded-pill p-s-2 text-label font-semibold ${FOCUS_RING} ${
      active ? "bg-surface text-ink hover:brightness-95" : "bg-transparent text-surface/80 hover:text-surface"
    }`}
  >
    {icon}
    {label}
  </button>
);
