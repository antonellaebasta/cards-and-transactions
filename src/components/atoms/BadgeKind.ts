export const BadgeKind = {
  Pending: "pending",
  Unavailable: "unavailable",
} as const;
export type BadgeKind = (typeof BadgeKind)[keyof typeof BadgeKind];
