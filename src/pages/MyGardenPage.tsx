import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { PageIntro } from "../components/common/PageIntro";
import { PlantGrid } from "../components/plants/PlantGrid";
import { plantById } from "../data";
import { useFavorites } from "../hooks/useFavorites";
import { useLanguage } from "../context/useLanguage";

export function MyGardenPage() {
  const { t } = useLanguage();
  const { favoriteIds } = useFavorites();
  const savedPlants = Array.from(favoriteIds, (plantId) => plantById.get(plantId))
    .filter((plant) => plant !== undefined);
  const savedCount = savedPlants.length;

  return (
    <>
      <PageIntro
        eyebrow={t("Your collection")}
        title={savedCount > 0 ? "Your garden is beginning to grow." : "Your garden is waiting to grow."}
        description={savedCount > 0 ? `${savedCount} ${t(savedCount === 1 ? "plant is" : "plants are")} ${t("saved in your personal collection.")}` : t("Save plants that interest you and return to your personal collection whenever you like.")}
      >
        <Link className="button button--primary" to="/plants">
          {t("Explore plants")}
        </Link>
      </PageIntro>

      {savedCount > 0 ? (
        <section className="my-garden-collection container" aria-labelledby="my-garden-heading" data-reveal>
          <div className="my-garden-collection__heading">
            <div>
              <p className="eyebrow">{t("Saved plants")}</p>
              <h2 id="my-garden-heading">{t("A collection that is yours")}</h2>
            </div>
            <p className="my-garden-collection__count" aria-live="polite">
              <strong>{savedCount}</strong> {t("plants")}
            </p>
          </div>
          <PlantGrid plants={savedPlants} />
        </section>
      ) : (
        <div className="my-garden-empty container">
          <EmptyState
            title="Your garden is waiting to grow."
            description="Save a plant from the directory or its profile, and it will be collected here."
            action={<Link className="button button--primary" to="/plants">{t("Explore plants")}</Link>}
          />
        </div>
      )}
    </>
  );
}
