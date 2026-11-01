import { Link } from "react-router-dom";
import { ArrowIcon, MapPinIcon } from "../common/Icons";
import { PlantImage } from "../plants/PlantImage";
import type { Region } from "../../types/content";
import type { Plant } from "../../types/plant";
import { getPlantImage } from "../../utils/plantImages";
import { useLanguage } from "../../context/useLanguage";

interface RegionCardProps {
  region: Region;
  plants: Plant[];
  selected: boolean;
}

export function RegionCard({ region, plants, selected }: RegionCardProps) {
  const { t } = useLanguage();
  const representativePlant = plants.find((plant) => plant.featured) ?? plants[0];

  return (
    <Link
      className={`region-card${selected ? " region-card--selected" : ""}`}
      to={`/regions?region=${region.id}#selected-region`}
      aria-current={selected ? "true" : undefined}
      data-reveal
    >
      {representativePlant ? (
        <PlantImage
          image={getPlantImage(representativePlant, "card")}
          plantName={t(representativePlant.commonName)}
          className="region-card__image"
        />
      ) : null}
      <span className="region-card__overlay" aria-hidden="true" />
      <span className="region-card__content">
        <span className="region-card__eyebrow"><MapPinIcon /> {t(region.eyebrow)}</span>
        <strong>{t(region.name)}</strong>
        <span>{plants.length} {t(plants.length === 1 ? "plant found" : "plants found")}</span>
      </span>
      <ArrowIcon className="region-card__arrow" />
    </Link>
  );
}
