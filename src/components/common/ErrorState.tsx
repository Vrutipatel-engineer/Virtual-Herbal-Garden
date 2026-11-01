import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information right now.",
  action,
}: ErrorStateProps) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <span className="state-panel__symbol" aria-hidden="true">!</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {action}
    </div>
  );
}
