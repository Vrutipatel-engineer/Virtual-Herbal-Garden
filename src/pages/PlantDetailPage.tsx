import { Link, useParams } from "react-router-dom";
import { PageIntro } from "../components/common/PageIntro";
import { getPlantBySlug } from "../utils/plants";

export function PlantDetailPage() {
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
          Return to plants
        </Link>
      </PageIntro>
    );
  }

  return (
    <PageIntro
      eyebrow={`${plant.category} · ${plant.plantType}`}
      title={plant.commonName}
      description={`${plant.scientificName} — ${plant.description}`}
    >
      <p className="phase-note">
        The complete encyclopedia layout and Plant Story arrive in Phase 3.
      </p>
    </PageIntro>
  );
}
