import { Link } from "react-router-dom";
import {
  ArrowIcon,
  BookIcon,
  CompassIcon,
  LeafIcon,
  SeedlingIcon,
  ShieldIcon,
} from "../components/common/Icons";
import { SectionHeading } from "../components/common/SectionHeading";
import { CategoryCard } from "../components/home/CategoryCard";
import { StatisticsSection } from "../components/home/StatisticsSection";
import { PlantGrid } from "../components/plants/PlantGrid";
import { PlantImage } from "../components/plants/PlantImage";
import { ResourceCard } from "../components/resources/ResourceCard";
import { plantCategories } from "../data/categories";
import { plants } from "../data/plants";
import { educationalResources } from "../data/resources";
import { getPlantImage } from "../utils/plantImages";
import { getPlantStatistics } from "../utils/plantStats";
import { getFeaturedPlants } from "../utils/plants";
import { useLanguage } from "../context/useLanguage";

const whyItems = [
  {
    icon: CompassIcon,
    title: "Discover with purpose",
    description:
      "Move beyond names and explore plants through place, form, habitat, and tradition.",
  },
  {
    icon: BookIcon,
    title: "Learn in context",
    description:
      "Read responsible botanical information without unsupported treatment claims.",
  },
  {
    icon: SeedlingIcon,
    title: "Understand diversity",
    description:
      "See how plant families, climates, and growing habits connect the collection.",
  },
  {
    icon: ShieldIcon,
    title: "Respect cultural context",
    description:
      "Explore documented plant traditions with context, care, and respect for the communities that hold them.",
  },
];

export function HomePage() {
  const { t } = useLanguage();
  const statistics = getPlantStatistics(plants);
  const featuredPlants = getFeaturedPlants().slice(0, 4);
  const featuredResources = educationalResources
    .filter((resource) => resource.featured)
    .slice(0, 3);
  const heroPlant = plants.find((plant) => plant.id === "tulsi") ?? plants[0];

  return (
    <>
      <section className="hero" aria-labelledby="home-title" data-reveal>
        <div className="container hero__grid">
          <div className="hero__content">
            <p className="eyebrow">{t("A living botanical library")}</p>
            <h1 id="home-title">{t("Discover the living world of plants.")}</h1>
            <p className="hero__lede">{t("Explore useful plants and trees, their traditional context, ecological roles, natural habitats, cultivation, and the knowledge that connects people with the living world.")}</p>
            <div className="button-row">
              <Link className="button button--primary" to="/plants">
                {t("Explore plants")} <ArrowIcon />
              </Link>
              <Link className="button button--secondary" to="/garden">
                {t("Enter the garden")}
              </Link>
            </div>
            <p className="hero__note">
              <LeafIcon /> {t("Thoughtfully documented for learning and discovery")}
            </p>
          </div>

          <div className="hero__visual">
            <div className="hero__frame">
              <PlantImage
                image={getPlantImage(heroPlant, "hero")}
                plantName={heroPlant.commonName}
                className="hero__plant-image"
                priority
                allowRetry
                sizes="(max-width: 64rem) 90vw, 42vw"
              />
              <div className="hero__caption">
                <span>{t("Featured specimen")}</span>
                <strong>{heroPlant.commonName}</strong>
                <em>{heroPlant.scientificName}</em>
              </div>
            </div>
            <div className="hero__annotation hero__annotation--top" aria-hidden="true">
              <span>01</span> {t("Aromatic foliage")}
            </div>
            <div className="hero__annotation hero__annotation--bottom" aria-hidden="true">
              Home garden · India
            </div>
          </div>
        </div>
      </section>

      <section className="section section--featured" aria-labelledby="featured-title" data-reveal>
        <div className="container">
          <SectionHeading
            id="featured-title"
            eyebrow={t("Curated collection")}
            title={t("Plants worth knowing")}
            description={t("Begin with familiar plants whose stories connect gardens, kitchens, landscapes, and traditional knowledge.")}
            action={
              <Link className="text-link" to="/plants">
                {t("View all plants")} <ArrowIcon />
              </Link>
            }
          />
          <PlantGrid plants={featuredPlants} prioritizeFirst={2} />
        </div>
      </section>

      <section className="section section--categories" aria-labelledby="categories-title" data-reveal>
        <div className="container">
          <SectionHeading
            id="categories-title"
            eyebrow={t("Follow your curiosity")}
            title={t("Explore by category")}
            description={t("Choose a botanical path and let the collection narrow itself around what interests you.")}
          />
          <div className="category-grid">
            {plantCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      <StatisticsSection statistics={statistics} />

      <section className="section why-section" aria-labelledby="why-title" data-reveal>
        <div className="container why-section__grid">
          <div className="why-section__intro">
            <p className="eyebrow">{t("Why Verdant?")}</p>
            <h2 id="why-title">{t("A calmer way to understand the plant world.")}</h2>
            <p>{t("Verdant brings botanical facts, geographic context, and traditional knowledge into one considered experience—made for curiosity, not quick claims.")}</p>
          </div>
          <div className="why-list">
            {whyItems.map(({ icon: Icon, title, description }, index) => (
              <article className="why-item" key={title}>
                <span className="why-item__number">0{index + 1}</span>
                <span className="why-item__icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{t(title)}</h3>
                  <p>{t(description)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section resource-preview" aria-labelledby="resources-title" data-reveal>
        <div className="container">
          <SectionHeading
            id="resources-title"
            eyebrow={t("Learn at your pace")}
            title={t("Build your botanical vocabulary")}
            description={t("Short, responsible guides make the details easier to understand before you step deeper into the garden.")}
            action={
              <Link className="text-link" to="/resources">
                {t("Explore all resources")} <ArrowIcon />
              </Link>
            }
          />
          <div className="resource-grid">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" data-reveal>
        <div className="container final-cta__inner">
          <span className="final-cta__mark" aria-hidden="true"><LeafIcon /></span>
          <p className="eyebrow">{t("Your path begins here")}</p>
          <h2>{t("Start exploring the garden.")}</h2>
          <p>{t("Follow a familiar name or discover something entirely new.")}</p>
          <div className="button-row">
            <Link className="button button--light" to="/plants">
              {t("Browse the collection")} <ArrowIcon />
            </Link>
            <Link className="button button--ghost-light" to="/garden">
              {t("Enter the garden")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
