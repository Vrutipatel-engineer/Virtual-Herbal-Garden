import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { ArrowIcon, LeafIcon } from "../common/Icons";
import type { PlantCategoryDefinition } from "../../types/content";
import { useLanguage } from "../../context/useLanguage";

interface CategoryCardProps {
  category: PlantCategoryDefinition;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const { t } = useLanguage();
  const parameter = category.kind === "category"
    ? "category"
    : category.kind === "plantType"
      ? "type"
      : "group";
  const value = category.kind === "curated" ? category.id : category.value;

  return (
    <Link
      className="category-card"
      to={`/plants?${parameter}=${encodeURIComponent(value)}`}
      style={{ "--category-index": index } as CSSProperties}
    >
      <span className="category-card__number" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="category-card__icon" aria-hidden="true">
        <LeafIcon />
      </span>
      <span className="category-card__content">
        <strong>{t(category.label)}</strong>
        <span>{t(category.description)}</span>
      </span>
      <ArrowIcon className="category-card__arrow" />
    </Link>
  );
}
