import { PageIntro } from "../components/common/PageIntro";
import { gardenPlacements } from "../data/gardenPlacements";

export function GardenPage() {
  return (
    <PageIntro
      eyebrow="Virtual garden"
      title="Step into a living collection"
      description={`The garden composition data is ready with ${gardenPlacements.length} naturally positioned plants across layered depths.`}
    >
      <p className="phase-note">
        The interactive, non-grid garden scene will be composed in Phase 4.
      </p>
    </PageIntro>
  );
}
