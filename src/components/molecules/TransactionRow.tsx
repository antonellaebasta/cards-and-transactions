import { AmountText } from "../atoms/AmountText";
import { Badge } from "../atoms/Badge";
import { BadgeKind } from "../atoms/BadgeKind";
import { TransactionStatus, type Transaction } from "../../adapters/types";

export type TransactionRowProps = {
  transaction: Transaction;
};

export const TransactionRow = ({ transaction }: TransactionRowProps) => (
  <li className="flex items-center justify-between border-b border-line p-s-4">
    <div>
      <p className="text-row font-semibold text-ink">{transaction.description}</p>
      <p className="text-meta text-ink-muted">TX {transaction.id}</p>
    </div>
    {transaction.status === TransactionStatus.Settled ? (
      <AmountText amount={transaction.amount} direction={transaction.direction} />
    ) : (
      <Badge
        kind={transaction.status === TransactionStatus.Pending ? BadgeKind.Pending : BadgeKind.Unavailable}
        label={transaction.status === TransactionStatus.Pending ? "Pending" : "Unavailable"}
      />
    )}
  </li>
);
