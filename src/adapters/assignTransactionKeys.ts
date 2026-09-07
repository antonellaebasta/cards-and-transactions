export const assignTransactionKeys = <T extends { id: string }>(
  items: readonly T[]
): (T & { key: string })[] => items.map((item, index) => ({ ...item, key: `${item.id}-${index}` }));
