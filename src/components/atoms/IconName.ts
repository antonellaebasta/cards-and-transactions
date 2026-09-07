export const IconName = {
  Check: "check",
  Schedule: "schedule",
  Block: "block",
  ArrowDownward: "arrow-downward",
  ArrowUpward: "arrow-upward",
} as const;
export type IconName = (typeof IconName)[keyof typeof IconName];
