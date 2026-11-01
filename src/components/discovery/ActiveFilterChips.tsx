import { CloseIcon } from "../common/Icons";
import { useLanguage } from "../../context/useLanguage";

export interface ActiveFilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onClear: () => void;
}

export function ActiveFilterChips({ chips, onClear }: ActiveFilterChipsProps) {
  const { t } = useLanguage();
  if (chips.length === 0) return null;

  return (
    <div className="active-filters" role="group" aria-label={t("Active filters")}>
      <div className="active-filters__chips">
        {chips.map((chip) => (
          <button
            className="filter-chip"
            type="button"
            key={chip.key}
            onClick={chip.onRemove}
            aria-label={`${chip.label} ${t("filter remove")}`}
          >
            {chip.label} <CloseIcon />
          </button>
        ))}
      </div>
      <button className="text-button" type="button" onClick={onClear}>
        {t("Clear all")}
      </button>
    </div>
  );
}
