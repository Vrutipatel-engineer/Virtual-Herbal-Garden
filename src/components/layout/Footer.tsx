import { Link } from "react-router-dom";
import { LeafIcon } from "../common/Icons";

const footerLinks = [
  { to: "/plants", label: "Plant directory" },
  { to: "/garden", label: "Virtual garden" },
  { to: "/regions", label: "Explore regions" },
  { to: "/resources", label: "Learning resources" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="brand__mark" aria-hidden="true">
            <LeafIcon />
          </span>
          <div>
            <p className="site-footer__name">Verdant</p>
            <p className="site-footer__note">
              A digital garden for thoughtful botanical discovery.
            </p>
          </div>
        </div>

        <nav className="site-footer__links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="site-footer__disclaimer">
          Plant information is provided for education and cultural context. It is
          not medical advice.
        </p>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Verdant Virtual Herbal Garden</p>
      </div>
    </footer>
  );
}
