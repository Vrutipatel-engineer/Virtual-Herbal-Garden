import { useLanguage } from "../../context/useLanguage";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "grid" | "detail";
  label?: string;
}

export function LoadingSkeleton({ count = 6, variant = "grid", label }: LoadingSkeletonProps) {
  const { t } = useLanguage();
  if (variant === "detail") {
    return (
      <div className="plant-detail-skeleton container" role="status" aria-label={label ?? t("Loading plant profile")} aria-busy="true">
        <span className="sr-only">{label ? t(label) : t("Loading plant profile")}…</span>
        <div className="plant-detail-skeleton__media skeleton skeleton--image" aria-hidden="true" />
        <div className="plant-detail-skeleton__body" aria-hidden="true">
          <div className="skeleton skeleton--eyebrow" />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--short" />
          <div className="skeleton skeleton--button" />
        </div>
      </div>
    );
  }

  return (
    <div className="plant-grid loading-grid" role="status" aria-label={t("Loading plants")} aria-busy="true">
      <span className="sr-only">{t("Loading plants…")}</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="plant-card-skeleton" key={index} aria-hidden="true">
          <div className="skeleton skeleton--image" />
          <div className="plant-card-skeleton__body">
            <div className="skeleton skeleton--eyebrow" />
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </div>
      ))}
    </div>
  );
}
