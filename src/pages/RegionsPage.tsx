import { PageIntro } from "../components/common/PageIntro";
import { regions } from "../data/regions";

export function RegionsPage() {
  return (
    <PageIntro
      eyebrow="Explore by region"
      title="Plants shaped by place"
      description={`${regions.length} regional contexts are prepared for meaningful, geography-led plant discovery.`}
    >
      <p className="phase-note">
        Region cards, counts, and filtered collections arrive in Phase 3.
      </p>
    </PageIntro>
  );
}
