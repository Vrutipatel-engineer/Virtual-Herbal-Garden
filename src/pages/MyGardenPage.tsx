import { Link } from "react-router-dom";
import { PageIntro } from "../components/common/PageIntro";

export function MyGardenPage() {
  return (
    <PageIntro
      eyebrow="Your collection"
      title="Your garden is waiting to grow."
      description="Save plants that interest you and return to your personal collection whenever you like."
    >
      <Link className="button button--primary" to="/plants">
        Explore plants
      </Link>
    </PageIntro>
  );
}
