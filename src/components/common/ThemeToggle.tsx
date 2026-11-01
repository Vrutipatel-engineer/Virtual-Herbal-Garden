import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "../../hooks/useTheme";
import { useLanguage } from "../../context/useLanguage";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggleTheme}
      aria-label={t(`Switch to ${nextTheme} theme`)}
      title={t(`Switch to ${nextTheme} theme`)}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
