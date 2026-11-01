import { LeafIcon, SeedlingIcon, ShieldIcon } from "../common/Icons";
import type { Plant } from "../../types/plant";
import { regions } from "../../data/regions";
import { useLanguage } from "../../context/useLanguage";

interface PlantStoryProps {
  plant: Plant;
}

const regionNameById = new Map(regions.map((region) => [region.id, region.name]));

export function PlantStory({ plant }: PlantStoryProps) {
  const { t } = useLanguage();
  const regionNames = plant.regions.map(
    (regionId) => regionNameById.get(regionId) ?? regionId,
  );

  return (
    <section className="plant-story" aria-labelledby="plant-story-title">
      <div className="container plant-story__layout">
        <aside className="plant-story__rail">
          <p className="eyebrow">{t("Plant story")}</p>
          <h2 id="plant-story-title">{t("From origin to cultivation.")}</h2>
          <p>{t("Follow this plant through the landscape, its recognizable form, and the uses or ecological roles associated with it.")}</p>
          <nav aria-label={`${t(plant.commonName)} ${t("story chapters")} `}>
            <a href="#story-origin">01 {t("Origin")}</a>
            <a href="#story-appearance">02 {t("Appearance")}</a>
            <a href="#story-tradition">
              03 {t(plant.gardenBenefits?.length ? "Garden benefits" : "Traditional uses")}
            </a>
            <a href="#story-habitat">04 {t("Habitat")}</a>
            <a href="#story-cultivation">05 {t("Cultivation")}</a>
            <a href="#story-facts">06 {t("Interesting facts")}</a>
          </nav>
        </aside>

        <div className="plant-story__chapters">
          <article className="story-chapter" id="story-origin" data-reveal>
            <span className="story-chapter__number">01</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("Where the story begins")}</p>
              <h3>{t("Origin and presence")}</h3>
              <p>{t(plant.story.origin)}</p>
              <p className="story-chapter__aside">{t("Current regional references")}: {regionNames.map((name) => t(name)).join(", ")}.</p>
            </div>
          </article>

          <article className="story-chapter" id="story-appearance" data-reveal>
            <span className="story-chapter__number">02</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("How to recognize it")}</p>
              <h3>{t("Appearance and character")}</h3>
              <ul className="characteristic-list">
                {plant.characteristics.map((characteristic) => (
                  <li key={characteristic}><LeafIcon /> {t(characteristic)}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="story-chapter" id="story-tradition" data-reveal>
            <span className="story-chapter__number">03</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("Knowledge in context")}</p>
              <h3>{t(plant.gardenBenefits?.length ? "Garden benefits" : "Traditional uses")}</h3>
              <p>{t(plant.story.culturalContext)}</p>
              {plant.gardenBenefits?.length ? (
                <div className="traditional-use-grid">
                  {plant.gardenBenefits.map((benefit) => (
                    <div className="traditional-use" key={benefit.category}>
                      <span>{t(benefit.category)}</span>
                      <p>{t(benefit.summary)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="traditional-use-grid">
                  {plant.traditionalUses.map((use) => (
                    <div className="traditional-use" key={use.category}>
                      <span>{t(use.category)}</span>
                      <p>{t(use.summary)}</p>
                    </div>
                  ))}
                </div>
              )}
              {plant.references && plant.references.length > 0 && (
                <ul className="plant-references" aria-label={`${t(plant.commonName)} ${t("references")}`}>
                  {plant.references.map((reference) => (
                    <li key={reference.url}>
                      <a href={reference.url} target="_blank" rel="noopener noreferrer">
                        {reference.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="responsibility-note">
                <ShieldIcon />
                <p>
                  {plant.gardenBenefits?.length
                    ? t("Wildlife and landscape benefits vary with species, local climate, and habitat. The downloaded tree models identify common tree groups, so scientific names are kept at genus level where the exact species is unspecified.")
                    : t("This section documents traditional and cultural knowledge for education. It does not recommend treatment or replace qualified medical advice.")}
                </p>
              </div>
            </div>
          </article>

          <article className="story-chapter" id="story-habitat" data-reveal>
            <span className="story-chapter__number">04</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("Where it thrives")}</p>
              <h3>{t("Habitat and climate")}</h3>
              <p>{t("Habitat profile for this plant")}: {plant.habitat.map((item) => t(item)).join(" · ")}; {t("climate profile")}: {plant.climate.map((item) => t(item)).join(" · ")}.</p>
              <div className="habitat-tags" aria-label={t("Habitat and climate tags")}>
                {[...plant.habitat, ...plant.climate].map((item) => <span key={item}>{t(item)}</span>)}
              </div>
            </div>
          </article>

          <article className="story-chapter" id="story-cultivation" data-reveal>
            <span className="story-chapter__number">05</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("Growing knowledge")}</p>
              <h3>{t("Cultivation guide")}</h3>
              <div className="cultivation-grid">
                {Object.entries(plant.cultivation).map(([label, value]) => (
                  <div className="cultivation-item" key={label}>
                    <SeedlingIcon />
                    <span>{t(label)}</span>
                    <p>{t(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="story-chapter" id="story-facts" data-reveal>
            <span className="story-chapter__number">06</span>
            <div className="story-chapter__content">
              <p className="eyebrow">{t("Look a little closer")}</p>
              <h3>{t("Interesting facts")}</h3>
              <ol className="interesting-facts">
                {plant.interestingFacts.map((fact, index) => (
                  <li key={fact}><span>{String(index + 1).padStart(2, "0")}</span>{t(fact)}</li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
