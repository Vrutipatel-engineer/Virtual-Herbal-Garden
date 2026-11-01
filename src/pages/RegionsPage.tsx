import { Link, useSearchParams } from "react-router-dom";
import { ArrowIcon, MapPinIcon } from "../components/common/Icons";
import { SectionHeading } from "../components/common/SectionHeading";
import { PlantGrid } from "../components/plants/PlantGrid";
import { RegionCard } from "../components/regions/RegionCard";
import { plants } from "../data/plants";
import { regions } from "../data/regions";
import { useLanguage } from "../context/useLanguage";

export function RegionsPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const requestedRegion = searchParams.get("region");
  const selectedRegion =
    regions.find((region) => region.id === requestedRegion) ?? regions[0];
  const selectedPlants = plants.filter((plant) =>
    plant.regions.includes(selectedRegion.id),
  );

  return (
    <>
      <header className="regions-hero" aria-labelledby="regions-title">
        <div className="container regions-hero__grid">
          <div>
            <p className="eyebrow">{t("Explore by region")}</p>
            <h1 id="regions-title">{t("Every landscape grows a different story.")}</h1>
          </div>
          <p>{t("Travel through Indian ecological regions and see how rain, altitude, heat, soil, and cultivation shape the plants represented in this garden.")}</p>
        </div>
      </header>

      <section className="section region-browser" aria-labelledby="region-browser-title">
        <div className="container">
          <SectionHeading
            id="region-browser-title"
            eyebrow={t("Choose a landscape")}
            title={t("Explore the collection geographically")}
            description={t("Counts are calculated directly from the plant dataset and will grow as the collection expands.")}
          />
          <div className="region-grid">
            {regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                plants={plants.filter((plant) => plant.regions.includes(region.id))}
                selected={region.id === selectedRegion.id}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="selected-region" className="selected-region" aria-labelledby="selected-region-title">
        <div className="container">
          <div className="selected-region__header">
            <div>
              <p className="eyebrow">{t("Currently exploring")}</p>
              <div className="selected-region__title-row">
                <span aria-hidden="true"><MapPinIcon /></span>
                <h2 id="selected-region-title">{t(selectedRegion.name)}</h2>
              </div>
            </div>
            <Link className="button button--secondary" to={`/plants?region=${selectedRegion.id}`}>
              {t("Open in directory")} <ArrowIcon />
            </Link>
          </div>

          <div className="selected-region__context">
            <p>{t(selectedRegion.description)}</p>
            <dl>
              <div>
                <dt>{t("Climate character")}</dt>
                <dd>{t(selectedRegion.climateNote)}</dd>
              </div>
              <div>
                <dt>{t("Plants represented")}</dt>
                <dd>{selectedPlants.length} {t("plants")} {t("in the current collection")}</dd>
              </div>
            </dl>
          </div>

          <PlantGrid plants={selectedPlants.slice(0, 6)} prioritizeFirst={2} />
        </div>
      </section>

    </>
  );
}
