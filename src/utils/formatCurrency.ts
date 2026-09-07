const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export const formatCurrency = (amount: number): string => formatter.format(amount);
