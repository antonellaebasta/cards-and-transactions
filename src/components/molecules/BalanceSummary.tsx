import { Badge } from "../atoms/Badge";
import { BadgeKind } from "../atoms/BadgeKind";
import { formatCurrency } from "../../utils/formatCurrency";

export type BalanceSummaryProps = {
  cardName: string;
  balance: number;
  pendingCount: number;
  unavailableCount: number;
};

export const BalanceSummary = ({ cardName, balance, pendingCount, unavailableCount }: BalanceSummaryProps) => (
  <div className="rounded-card border border-line bg-surface p-s-5">
    <h2 className="text-label font-semibold text-ink-muted">Current balance · {cardName}</h2>
    <div className="flex items-end justify-between gap-s-4">
      <p className="text-balance font-medium text-ink">{formatCurrency(balance)}</p>
      {(pendingCount > 0 || unavailableCount > 0) && (
        <div className="flex gap-s-4 pb-s-1">
          {pendingCount > 0 && <Badge kind={BadgeKind.Pending} label={`${pendingCount} pending`} />}
          {unavailableCount > 0 && <Badge kind={BadgeKind.Unavailable} label={`${unavailableCount} unavailable`} />}
        </div>
      )}
    </div>
  </div>
);
