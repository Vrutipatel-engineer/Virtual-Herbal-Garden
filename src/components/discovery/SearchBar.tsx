import { CloseIcon, SearchIcon } from "../common/Icons";
import { useLanguage } from "../../context/useLanguage";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  const { t } = useLanguage();
  return (
    <div className="search-area">
      <label className="search-bar">
        <span className="sr-only">{t("Search plants")}</span>
        <SearchIcon className="search-bar__icon" />
        <input
          type="search"
          value={value}
          placeholder={t("Search by common, scientific, or local name")}
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="search-bar__clear"
            aria-label={t("Clear plant search")}
            onClick={() => onChange("")}
          >
            <CloseIcon />
          </button>
        ) : null}
      </label>
      <p className="search-area__count" aria-live="polite">
        {resultCount} {t("plants")} {t("found")}
      </p>
    </div>
  );
}
