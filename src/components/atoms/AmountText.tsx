import { TransactionDirection } from "../../adapters/types";
import { formatCurrency } from "../../utils/formatCurrency";

export type AmountTextProps = {
  amount: number;
  direction: TransactionDirection;
};

export const AmountText = ({ amount, direction }: AmountTextProps) => {
  const isCredit = direction === TransactionDirection.In;
  const formatted = formatCurrency(amount);

  if (isCredit) {
    return (
      <span className="inline-flex items-center justify-center rounded-pill bg-positive px-s-3 py-s-1 text-amount font-medium leading-none text-ink">
        +{formatted}
      </span>
    );
  }

  return <span className="text-amount font-medium leading-none text-ink">{formatted}</span>;
};
