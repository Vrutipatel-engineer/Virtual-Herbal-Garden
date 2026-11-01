import type { PlantSort } from "../../types/plant";
import { useLanguage } from "../../context/useLanguage";

interface SortControlProps {
  value: PlantSort;
  onChange: (value: PlantSort) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  const { t } = useLanguage();
  return (
    <label className="sort-control">
      <span>{t("Sort by")}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as PlantSort)}
      >
        <option value="featured">{t("Featured first")}</option>
        <option value="name-asc">{t("Name A–Z")}</option>
        <option value="name-desc">{t("Name Z–A")}</option>
      </select>
    </label>
  );
}
