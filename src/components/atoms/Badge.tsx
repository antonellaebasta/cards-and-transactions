import { Icon } from "./Icon";
import { IconName } from "./IconName";
import { BadgeKind } from "./BadgeKind";

export type BadgeProps = {
  kind: BadgeKind;
  label: string;
};

const ICON_NAME: Record<BadgeKind, IconName> = {
  [BadgeKind.Pending]: IconName.Schedule,
  [BadgeKind.Unavailable]: IconName.Block,
};

export const Badge = ({ kind, label }: BadgeProps) => (
  <span className="inline-flex items-center gap-s-1 text-amount font-medium text-warning-deep">
    <Icon name={ICON_NAME[kind]} />
    <span className="leading-none">{label}</span>
  </span>
);
