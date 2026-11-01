import { Link } from "react-router-dom";
import { ArrowIcon, BookIcon } from "../common/Icons";
import type { EducationalResource } from "../../types/content";
import { useLanguage } from "../../context/useLanguage";

interface ResourceCardProps {
  resource: EducationalResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { t } = useLanguage();
  return (
    <article className="resource-card">
      <div className="resource-card__meta">
        <span className="resource-card__icon" aria-hidden="true">
          <BookIcon />
        </span>
        <span>{t(resource.category)}</span>
        <span aria-hidden="true">·</span>
        <span>{resource.readingTime} {t("min read")}</span>
      </div>
      <h3>{t(resource.title)}</h3>
      <p>{t(resource.description)}</p>
      <Link className="resource-card__link" to={`/resources/${resource.id}`}>
        {t("Read guide")} <ArrowIcon />
      </Link>
    </article>
  );
}
