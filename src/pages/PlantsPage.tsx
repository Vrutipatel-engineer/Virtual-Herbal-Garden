import { PageIntro } from "../components/common/PageIntro";
import { plants } from "../data/plants";

export function PlantsPage() {
  return (
    <PageIntro
      eyebrow="Plant directory"
      title="Explore the collection"
      description={`A structured collection of ${plants.length} medicinal, aromatic, culinary, and nutritive plants is ready for discovery.`}
    >
      <p className="phase-note">
        Search, filters, sorting, and the responsive plant grid arrive in Phase 2.
      </p>
    </PageIntro>
  );
}
