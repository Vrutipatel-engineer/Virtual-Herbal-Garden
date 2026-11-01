import type { PlantStatistics } from "../../utils/plantStats";
import { useLanguage } from "../../context/useLanguage";

interface StatisticsSectionProps {
  statistics: PlantStatistics;
}

export function StatisticsSection({ statistics }: StatisticsSectionProps) {
  const { t } = useLanguage();
  const items = [
    { value: statistics.totalPlants, label: "Plants documented" },
    { value: statistics.categories, label: "Knowledge categories" },
    { value: statistics.regions, label: "Regions represented" },
    { value: statistics.families, label: "Plant families" },
  ];

  return (
    <section className="statistics-section" aria-labelledby="statistics-title">
      <div className="container statistics-section__inner">
        <div className="statistics-section__intro">
          <p className="eyebrow">{t("The collection at a glance")}</p>
          <h2 id="statistics-title">{t("Knowledge that grows with every plant.")}</h2>
        </div>
        <dl className="statistics-grid">
          {items.map((item) => (
            <div className="statistic" key={item.label}>
              <dt>{t(item.label)}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
