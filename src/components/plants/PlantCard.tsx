import { Link } from "react-router-dom";
import { ArrowIcon, MapPinIcon } from "../common/Icons";
import type { Plant } from "../../types/plant";
import { regions } from "../../data/regions";
import { getPlantImage } from "../../utils/plantImages";
import { FavoriteButton } from "./FavoriteButton";
import { PlantImage } from "./PlantImage";
import { useLanguage } from "../../context/useLanguage";

interface PlantCardProps {
  plant: Plant;
  priority?: boolean;
}

const regionNameById = new Map(regions.map((region) => [region.id, region.name]));

export function PlantCard({ plant, priority = false }: PlantCardProps) {
  const { t } = useLanguage();
  const primaryRegion = regionNameById.get(plant.regions[0]) ?? plant.regions[0];

  return (
    <article className="plant-card" data-reveal>
      <div className="plant-card__media">
        <Link to={`/plants/${plant.slug}`} aria-label={`${t("Explore plants")}: ${t(plant.commonName)}`}>
          <PlantImage
            image={getPlantImage(plant, "card")}
            plantName={t(plant.commonName)}
            priority={priority}
          />
        </Link>
        <FavoriteButton
          plantId={plant.id}
          plantName={plant.commonName}
          className="plant-card__favorite"
        />
        <span className="plant-card__category">{t(plant.category)}</span>
        <a
          className="plant-card__image-credit"
          href={getPlantImage(plant, "card").sourceId ?? "#"}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t("Image credit")}: ${(getPlantImage(plant, "card").credit ?? "").replace("Photo:", t("Photo:"))}; ${t("view original source")}`}
        >
          {(getPlantImage(plant, "card").credit ?? "").replace("Photo:", t("Photo:"))}
        </a>
      </div>

      <div className="plant-card__body">
        <div className="plant-card__heading">
          <div>
            <h3>
            <Link to={`/plants/${plant.slug}`}>{t(plant.commonName)}</Link>
            </h3>
            <p className="plant-card__scientific">{plant.scientificName}</p>
          </div>
        </div>

        <p className="plant-card__description">{t(plant.description)}</p>

        <div className="plant-card__footer">
          <span className="plant-card__region">
            <MapPinIcon /> {t(primaryRegion)}
          </span>
          <Link className="plant-card__link" to={`/plants/${plant.slug}`}>
            {t("Explore plants")} <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
