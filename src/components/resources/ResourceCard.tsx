import { Link } from "react-router-dom";
import { ArrowIcon, BookIcon } from "../common/Icons";
import type { EducationalResource } from "../../types/content";
import { useLanguage } from "../../context/useLanguage";
import { plantById } from "../../data/plants";
import { getPlantImage } from "../../utils/plantImages";
import { PlantImage } from "../plants/PlantImage";

const imagePlantByCategory = {
  Foundations: "tulsi",
  Botany: "amla",
  Identification: "ashwagandha",
  Cultivation: "aloe-vera",
  "Responsible use": "neem",
} as const;

interface ResourceCardProps {
  resource: EducationalResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { t } = useLanguage();
  const featuredPlant = plantById.get(imagePlantByCategory[resource.category]);
  const image = featuredPlant ? getPlantImage(featuredPlant, "card") : undefined;
  return (
    <article className="resource-card" data-reveal>
      {featuredPlant && image ? (
        <div className="resource-card__visual">
          <PlantImage
            image={image}
            plantName={t(featuredPlant.commonName)}
            className="resource-card__image"
            sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
          />
          <a
            className="resource-card__image-credit"
            href={image.sourceId ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t("Image credit")}: ${(image.credit ?? "").replace("Photo:", t("Photo:"))}; ${t("view original source")}`}
          >
            {(image.credit ?? "").replace("Photo:", t("Photo:"))}
          </a>
        </div>
      ) : null}
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
