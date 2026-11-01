import { Link } from "react-router-dom";
import { ArrowIcon } from "../common/Icons";
import { SectionHeading } from "../common/SectionHeading";
import type { Plant } from "../../types/plant";
import { plants } from "../../data/plants";
import { getSimilarPlants } from "../../utils/similarPlants";
import { PlantGrid } from "./PlantGrid";
import { useLanguage } from "../../context/useLanguage";

interface SimilarPlantsProps {
  plant: Plant;
}

export function SimilarPlants({ plant }: SimilarPlantsProps) {
  const { t } = useLanguage();
  const recommendations = getSimilarPlants(plant, plants, 3);

  return (
    <section className="section similar-plants" aria-labelledby="similar-plants-title" data-reveal>
      <div className="container">
        <SectionHeading
          id="similar-plants-title"
          eyebrow={t("Continue discovering")}
          title={t("You may also like")}
          description={t("Chosen through shared categories, growing forms, habitats, climates, and regions—not at random.")}
          action={<Link className="text-link" to="/plants">{t("View directory")} <ArrowIcon /></Link>}
        />
        <PlantGrid plants={recommendations} />
      </div>
    </section>
  );
}
