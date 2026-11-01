import type { ReactNode } from "react";
import { LeafIcon } from "./Icons";
import { useLanguage } from "../../context/useLanguage";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { t } = useLanguage();
  return (
    <div className="state-panel" role="status">
      <span className="state-panel__icon" aria-hidden="true">
        <LeafIcon />
      </span>
      <h2>{t(title)}</h2>
      <p>{t(description)}</p>
      {action}
    </div>
  );
}
