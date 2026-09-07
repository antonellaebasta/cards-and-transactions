import { FOCUS_RING } from "../../classNames";

export type ErrorNoticeProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorNotice = ({ message, onRetry }: ErrorNoticeProps) => (
  <div role="alert" className="rounded-card border-2 border-error p-s-5">
    <p className="text-row text-error-deep">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className={`cursor-pointer text-label font-semibold text-link-deep underline hover:text-link ${FOCUS_RING}`}
    >
      Retry
    </button>
  </div>
);
