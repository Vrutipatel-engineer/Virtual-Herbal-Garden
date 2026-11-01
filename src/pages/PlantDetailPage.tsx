import { Link, useParams } from "react-router-dom";
import { ArrowIcon } from "../components/common/Icons";
import { PageIntro } from "../components/common/PageIntro";
import { PlantHero } from "../components/plants/PlantHero";
import { PlantStory } from "../components/plants/PlantStory";
import { QuickFacts } from "../components/plants/QuickFacts";
import { SimilarPlants } from "../components/plants/SimilarPlants";
import { getPlantBySlug } from "../utils/plants";
import { useLanguage } from "../context/useLanguage";

export function PlantDetailPage() {
  const { t } = useLanguage();
  const { id = "" } = useParams();
  const plant = getPlantBySlug(id);

  if (!plant) {
    return (
      <PageIntro
        eyebrow="Plant not found"
        title="This plant is not in the garden yet."
        description="The address may be incorrect, or the plant record may have moved."
      >
        <Link className="button button--primary" to="/plants">
          {t("Return to plants")} <ArrowIcon />
        </Link>
      </PageIntro>
    );
  }

  return (
    <article className="plant-detail">
      <PlantHero plant={plant} />
      <QuickFacts plant={plant} />

      <section className="plant-overview" aria-labelledby="plant-overview-title" data-reveal>
        <div className="container plant-overview__grid">
          <div>
            <p className="eyebrow">{t("Overview")}</p>
            <h2 id="plant-overview-title">{t("Meet this plant.")}</h2>
          </div>
          <div className="plant-overview__copy">
            <p>{t(plant.description)}</p>
            <p>{t("This profile brings together botanical characteristics, habitat, general cultivation guidance, and carefully framed traditional context so each part can be understood in relation to the whole plant.")}</p>
          </div>
        </div>
      </section>

      <PlantStory plant={plant} />
      <SimilarPlants plant={plant} />
    </article>
  );
}
