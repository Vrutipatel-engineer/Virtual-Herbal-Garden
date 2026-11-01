import { Link } from "react-router-dom";
import { PageIntro } from "../components/common/PageIntro";
import { useLanguage } from "../context/useLanguage";

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <PageIntro
      eyebrow={t("404 · Path not found")}
      title="This path has grown quiet."
      description="The page you were looking for does not exist or may have moved."
    >
      <Link className="button button--primary" to="/">
        {t("Return home")}
      </Link>
    </PageIntro>
  );
}
