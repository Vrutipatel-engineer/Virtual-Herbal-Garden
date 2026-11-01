import { Link, useParams } from "react-router-dom";
import { ArrowIcon } from "../components/common/Icons";
import { PageIntro } from "../components/common/PageIntro";
import { educationalResources } from "../data/resources";
import { useLanguage } from "../context/useLanguage";

export function ResourceDetailPage() {
  const { t } = useLanguage();
  const { id = "" } = useParams();
  const resource = educationalResources.find((item) => item.id === id);

  if (!resource) {
    return (
      <PageIntro
        eyebrow="Guide not found"
        title="This guide is not in the library."
        description="The address may be incorrect, or this learning guide may have moved."
      >
        <Link className="button button--primary" to="/resources">
          {t("Return to resources")} <ArrowIcon />
        </Link>
      </PageIntro>
    );
  }

  return (
    <article className="resource-detail">
      <header className="resource-detail__hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label={t("Breadcrumb")}>
            <Link to="/">{t("Home")}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/resources">{t("Resources")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{resource.title}</span>
          </nav>
          <p className="eyebrow">{t(resource.category)} · {resource.readingTime} {t("min read")}</p>
          <h1>{t(resource.title)}</h1>
          <p className="resource-detail__lede">{t(resource.description)}</p>
        </div>
      </header>

      <div className="container resource-detail__layout">
        <div className="resource-detail__chapters">
          {resource.sections.map((section, index) => (
            <section className="resource-detail__chapter" key={section.heading} aria-labelledby={`resource-section-${index}`}>
              <span className="resource-detail__chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`resource-section-${index}`}>{t(section.heading)}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
              </div>
            </section>
          ))}
          <aside className="resource-detail__note">
            <p className="eyebrow">{t("A note on responsible learning")}</p>
            <p>{t("These guides are for general education. They are not medical, diagnostic, or treatment advice. Consult qualified professionals for health or plant-identification questions.")}</p>
          </aside>
          <Link className="button button--primary" to="/plants">
            {t("Explore the plant directory")} <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
