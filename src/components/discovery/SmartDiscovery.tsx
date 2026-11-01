import { Link } from "react-router-dom";
import { ArrowIcon, CompassIcon, LeafIcon } from "../common/Icons";
import { SectionHeading } from "../common/SectionHeading";
import { discoveryPaths } from "../../data/discoveryPaths";
import { useLanguage } from "../../context/useLanguage";

export function SmartDiscovery() {
  const { t } = useLanguage();
  return (
    <section className="smart-discovery" aria-labelledby="smart-discovery-title">
      <div className="container">
        <SectionHeading
          id="smart-discovery-title"
          eyebrow={t("Smart discovery")}
          title={t("Start with an idea, not a plant name.")}
          description={t("Choose a natural-language path and the directory will apply meaningful plant attributes for you.")}
        />
        <div className="discovery-paths">
          {discoveryPaths.map((path, index) => (
            <Link
              className={`discovery-path discovery-path--${path.accent}`}
              key={path.id}
              to={`/plants?${new URLSearchParams(path.filters).toString()}#directory-results`}
            >
              <span className="discovery-path__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="discovery-path__icon" aria-hidden="true">
                {index % 2 === 0 ? <CompassIcon /> : <LeafIcon />}
              </span>
              <span className="discovery-path__prompt">“{t(path.prompt)}”</span>
              <strong>{t(path.title)}</strong>
              <span className="discovery-path__description">{t(path.description)}</span>
              <span className="discovery-path__action">{t("Discover")} <ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
