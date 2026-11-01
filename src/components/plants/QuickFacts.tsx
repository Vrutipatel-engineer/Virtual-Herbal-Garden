import type { Plant } from "../../types/plant";
import { regions } from "../../data/regions";
import { useLanguage } from "../../context/useLanguage";

interface QuickFactsProps {
  plant: Plant;
}

const regionNameById = new Map(regions.map((region) => [region.id, region.name]));

export function QuickFacts({ plant }: QuickFactsProps) {
  const { t } = useLanguage();
  const facts = [
    { label: "Scientific name", value: plant.scientificName, italic: true },
    { label: "Family", value: plant.family },
    { label: "Plant type", value: plant.plantType },
    {
      label: "Regions",
      value: plant.regions
        .map((regionId) => regionNameById.get(regionId) ?? regionId)
        .map((name) => t(name)).join(", "),
    },
    { label: "Habitat", value: plant.habitat.map((item) => t(item)).join(", ") },
    { label: "Climate", value: plant.climate.map((item) => t(item)).join(", ") },
  ];

  return (
    <section className="quick-facts" aria-labelledby="quick-facts-title">
      <div className="container quick-facts__inner">
        <div className="quick-facts__heading">
          <p className="eyebrow">{t("At a glance")}</p>
          <h2 id="quick-facts-title">{t("Quick facts")}</h2>
        </div>
        <dl className="quick-facts__grid">
          {facts.map((fact) => (
            <div className="quick-fact" key={fact.label}>
              <dt>{t(fact.label)}</dt>
              <dd className={fact.italic ? "quick-fact__scientific" : undefined}>
                {fact.italic ? fact.value : t(fact.value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
