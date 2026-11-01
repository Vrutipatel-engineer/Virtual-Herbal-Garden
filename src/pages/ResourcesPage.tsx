import { useMemo, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { ResourceCard } from "../components/resources/ResourceCard";
import { educationalResources } from "../data/resources";
import type { ResourceCategory } from "../types/content";
import { useLanguage } from "../context/useLanguage";
import { plantById } from "../data/plants";
import { getPlantImage } from "../utils/plantImages";
import { PlantImage } from "../components/plants/PlantImage";

const resourceCategories: ResourceCategory[] = [
  "Foundations",
  "Botany",
  "Identification",
  "Cultivation",
  "Responsible use",
];

export function ResourcesPage() {
  const { t } = useLanguage();
  const featuredPlant = plantById.get("tulsi");
  const featuredImage = featuredPlant ? getPlantImage(featuredPlant, "hero") : undefined;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const selectedCategory = searchParams.get("category") ?? "all";
  const resources = useMemo(
    () => selectedCategory === "all"
      ? educationalResources
      : educationalResources.filter((resource) => resource.category === selectedCategory),
    [selectedCategory],
  );

  const changeCategory = (category: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === "all") nextParams.delete("category");
    else nextParams.set("category", category);
    startTransition(() => setSearchParams(nextParams, { replace: true }));
  };

  return (
    <>
      <header className="directory-hero" aria-labelledby="resources-title">
        <div className="container directory-hero__inner resources-hero__inner">
          <div className="directory-hero__copy" data-reveal>
            <p className="eyebrow">{t("Educational resources")}</p>
            <h1 id="resources-title">{t("Learn the language of plants.")}</h1>
            <p>{t("Clear, responsible guides to botanical observation, cultivation, plant families, and herbal knowledge.")}</p>
          </div>
          {featuredPlant && featuredImage ? (
            <figure className="resources-hero__visual" data-reveal>
              <PlantImage
                image={featuredImage}
                plantName={t(featuredPlant.commonName)}
                className="resources-hero__image"
                priority
                sizes="(max-width: 64rem) 100vw, 42vw"
              />
              <figcaption className="resources-hero__caption">
                <div className="resources-summary">
                  <span>{t("Learning library")}</span>
                  <strong>{educationalResources.length}</strong>
                  <span>{t("short guides to explore")}</span>
                </div>
                <a
                  className="resources-hero__credit"
                  href={featuredImage.sourceId ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${t("Image credit")}: ${(featuredImage.credit ?? "").replace("Photo:", t("Photo:"))}; ${t("view original source")}`}
                >
                  {(featuredImage.credit ?? "").replace("Photo:", t("Photo:"))}
                </a>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </header>

      <section className="resources-directory container" aria-labelledby="resource-library-title">
        <div className="resources-toolbar" data-reveal>
          <div>
            <p className="eyebrow">{t("Browse by topic")}</p>
            <h2 id="resource-library-title">{t("A thoughtful place to begin")}</h2>
          </div>
          <label className="resource-category-filter">
            <span>{t("Resource category")}</span>
            <select
              value={selectedCategory}
              onChange={(event) => changeCategory(event.target.value)}
            >
              <option value="all">{t("All topics")}</option>
              {resourceCategories.map((category) => (
                <option key={category} value={category}>{t(category)}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="resources-result-count" aria-live="polite" data-reveal>
          {t("Showing")} <strong>{resources.length}</strong> {t("of")} {educationalResources.length} {t("guides")}
        </p>

        <div className={`resource-grid resources-grid${isPending ? " resources-grid--pending" : ""}`} aria-busy={isPending}>
          {resources.length > 0 ? resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          )) : (
            <EmptyState
              title="No guides in this category"
              description="Choose another topic to continue exploring the learning library."
              action={
                <button className="button button--primary" type="button" onClick={() => changeCategory("all")}>
                  {t("Browse all guides")}
                </button>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}
