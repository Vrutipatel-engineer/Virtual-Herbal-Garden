import { Link } from "react-router-dom";
import { LeafIcon, MapPinIcon } from "../common/Icons";
import type { Plant } from "../../types/plant";
import { regions } from "../../data/regions";
import { getPlantImage } from "../../utils/plantImages";
import { FavoriteButton } from "./FavoriteButton";
import { PlantImage } from "./PlantImage";
import { useLanguage } from "../../context/useLanguage";

interface PlantHeroProps {
  plant: Plant;
}

const regionNameById = new Map(regions.map((region) => [region.id, region.name]));

export function PlantHero({ plant }: PlantHeroProps) {
  const { t } = useLanguage();
  const regionNames = plant.regions
    .map((regionId) => regionNameById.get(regionId))
    .filter(Boolean);

  return (
    <header className="plant-hero">
      <div className="container">
        <nav className="breadcrumbs" aria-label={t("Breadcrumb")}>
          <Link to="/">{t("Home")}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/plants">{t("Plants")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t(plant.commonName)}</span>
        </nav>

        <div className="plant-hero__grid">
          <div className="plant-hero__media">
            <PlantImage
              image={getPlantImage(plant, "hero")}
              plantName={t(plant.commonName)}
              className="plant-hero__image"
              priority
              allowRetry
              sizes="(max-width: 64rem) 100vw, 56vw"
            />
            <p className="plant-hero__image-note">
              <LeafIcon />
              <a href={getPlantImage(plant, "hero").sourceId ?? "#"} target="_blank" rel="noreferrer">
                {t("Image credit")}: {(getPlantImage(plant, "hero").credit ?? "").replace("Photo:", t("Photo:"))}
              </a>
            </p>
          </div>

          <div className="plant-hero__content">
            <div className="plant-hero__labels">
              <span>{t(plant.category)}</span>
              <span>{t(plant.plantType)}</span>
            </div>
            <h1>{t(plant.commonName)}</h1>
            <p className="plant-hero__scientific">{plant.scientificName}</p>
            <p className="plant-hero__description">{t(plant.description)}</p>
            <div className="plant-hero__meta">
              <MapPinIcon />
              <span>{regionNames.map((name) => t(name ?? "")).join(" · ")}</span>
            </div>
            <div className="plant-hero__actions">
              <FavoriteButton plantId={plant.id} plantName={plant.commonName} />
              <span>{t("Save this plant to My Garden")}</span>
            </div>
            <p className="plant-hero__local-names">
              <span>{t("Also known as")}</span> {plant.localNames.map((name) => t(name)).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
