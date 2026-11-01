import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CloseIcon, LeafIcon, MenuIcon } from "../common/Icons";
import { ThemeToggle } from "../common/ThemeToggle";
import { useLanguage } from "../../context/useLanguage";

const navItems = [
  { to: "/plants", label: "Explore Plants" },
  { to: "/garden", label: "Virtual Garden" },
  { to: "/regions", label: "Regions" },
  { to: "/resources", label: "Learn" },
  { to: "/my-garden", label: "My Garden" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuWasOpenRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (menuWasOpenRef.current) menuButtonRef.current?.focus();
    menuWasOpenRef.current = false;
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label={t("Verdant home")}>
          <span className="brand__mark" aria-hidden="true">
            <LeafIcon />
          </span>
          <span className="brand__wordmark">Verdant</span>
          <span className="brand__descriptor">{t("Herbal Garden")}</span>
        </Link>

        <nav className="desktop-nav" aria-label={t("Primary navigation")}>
          {navItems.map((item) => (
          <NavLink
              key={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
              to={item.to}
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="language-toggle"
            type="button"
            aria-label={language === "en" ? "हिन्दी में बदलें" : "Switch to English"}
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          >
            {language === "en" ? "हिन्दी" : "English"}
          </button>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? t("Close navigation menu") : t("Open navigation menu")}
            onClick={() => {
              const nextOpen = !menuOpen;
              menuWasOpenRef.current = nextOpen;
              setMenuOpen(nextOpen);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}
        aria-label={t("Mobile navigation")}
        aria-hidden={!menuOpen}
      >
        <div className="container mobile-nav__inner">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`
              }
              tabIndex={menuOpen ? 0 : -1}
              to={item.to}
            >
              {t(item.label)}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
