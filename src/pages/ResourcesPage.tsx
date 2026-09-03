import { PageIntro } from "../components/common/PageIntro";
import { educationalResources } from "../data/resources";

export function ResourcesPage() {
  return (
    <PageIntro
      eyebrow="Educational resources"
      title="Learn the language of plants"
      description={`${educationalResources.length} responsible learning guides are structured and ready for the educational experience.`}
    >
      <p className="phase-note">
        Resource browsing and category filters arrive in Phase 6.
      </p>
    </PageIntro>
  );
}
