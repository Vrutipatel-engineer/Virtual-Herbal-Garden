import { Link } from "react-router-dom";
import { PageIntro } from "../components/common/PageIntro";

export function NotFoundPage() {
  return (
    <PageIntro
      eyebrow="404 · Path not found"
      title="This path has grown quiet."
      description="The page you were looking for does not exist or may have moved."
    >
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </PageIntro>
  );
}
