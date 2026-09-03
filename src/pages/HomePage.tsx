import { Link } from "react-router-dom";
import { ArrowIcon, LeafIcon } from "../components/common/Icons";
import { plants } from "../data/plants";
import { getPlantStatistics } from "../utils/plantStats";

export function HomePage() {
  const statistics = getPlantStatistics(plants);

  return (
    <>
      <section className="foundation-hero" aria-labelledby="home-title">
        <div className="container foundation-hero__grid">
          <div className="foundation-hero__content">
            <p className="eyebrow">A living botanical library</p>
            <h1 id="home-title">Discover the healing world of plants.</h1>
            <p className="foundation-hero__lede">
              Explore medicinal and herbal plants, their traditional context,
              natural habitats, and the knowledge that connects people with the
              living world.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/plants">
                Explore plants <ArrowIcon />
              </Link>
              <Link className="button button--secondary" to="/garden">
                Enter the garden
              </Link>
            </div>
          </div>

          <div className="foundation-hero__visual" aria-hidden="true">
            <div className="botanical-orbit botanical-orbit--outer" />
            <div className="botanical-orbit botanical-orbit--inner" />
            <div className="botanical-emblem">
              <LeafIcon width={56} height={56} />
              <span>Botanical knowledge</span>
              <strong>Rooted in context</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="foundation-stats" aria-label="Garden statistics">
        <div className="container foundation-stats__grid">
          {[
            [statistics.totalPlants, "Plants documented"],
            [statistics.categories, "Knowledge categories"],
            [statistics.regions, "Regions represented"],
            [statistics.families, "Plant families"],
          ].map(([value, label]) => (
            <div className="foundation-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="foundation-note">
        <div className="container foundation-note__inner">
          <p className="eyebrow">Foundation established</p>
          <h2>The garden now has strong roots.</h2>
          <p>
            The accessible layout, responsive navigation, botanical design system,
            routes, structured data, and flexible image pipeline are ready for the
            next visual implementation phase.
          </p>
        </div>
      </section>
    </>
  );
}
