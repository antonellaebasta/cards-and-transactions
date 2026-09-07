import type { ReactNode } from "react";
import { IconName } from "./IconName";

export type IconProps = {
  name: IconName;
  className?: string;
};

const ICON_CONTENT: Record<IconName, ReactNode> = {
  [IconName.Check]: <path d="M5 13l4 4L19 7" />,
  [IconName.Schedule]: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2.1" />
    </>
  ),
  [IconName.Block]: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" />
    </>
  ),
  [IconName.ArrowDownward]: <path d="M12 4v16M6 14l6 6 6-6" />,
  [IconName.ArrowUpward]: <path d="M12 20V4M6 10l6-6 6 6" />,
};

export const Icon = ({ name, className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {ICON_CONTENT[name]}
  </svg>
);
