import type { Climate, Habitat, PlantCategory, PlantType } from "../../types/plant";
import { useLanguage } from "../../context/useLanguage";

export type DirectoryFilterKey =
  | "category"
  | "plantType"
  | "region"
  | "habitat"
  | "climate";

interface FilterValues {
  category: PlantCategory | "";
  plantType: PlantType | "";
  region: string;
  habitat: Habitat | "";
  climate: Climate | "";
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  idPrefix: string;
  values: FilterValues;
  options: {
    categories: FilterOption[];
    plantTypes: FilterOption[];
    regions: FilterOption[];
    habitats: FilterOption[];
    climates: FilterOption[];
  };
  onChange: (key: DirectoryFilterKey, value: string) => void;
}

const SelectField = ({
  id,
  label,
  value,
  options,
  onChange,
  idPrefix,
}: {
  id: DirectoryFilterKey;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: FilterPanelProps["onChange"];
  idPrefix: string;
}) => {
  const { t } = useLanguage();
  return (
    <label className="filter-field" htmlFor={`${idPrefix}-${id}`}>
      <span>{t(label)}</span>
      <select
        id={`${idPrefix}-${id}`}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
      >
        <option value="">{t(`All ${label}`)}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.label)}
          </option>
        ))}
      </select>
    </label>
  );
};

export function FilterPanel({ idPrefix, values, options, onChange }: FilterPanelProps) {
  return (
    <div className="filter-panel">
      <SelectField id="category" label="Categories" value={values.category} options={options.categories} onChange={onChange} idPrefix={idPrefix} />
      <SelectField id="plantType" label="Plant types" value={values.plantType} options={options.plantTypes} onChange={onChange} idPrefix={idPrefix} />
      <SelectField id="region" label="Regions" value={values.region} options={options.regions} onChange={onChange} idPrefix={idPrefix} />
      <SelectField id="habitat" label="Habitats" value={values.habitat} options={options.habitats} onChange={onChange} idPrefix={idPrefix} />
      <SelectField id="climate" label="Climates" value={values.climate} options={options.climates} onChange={onChange} idPrefix={idPrefix} />
    </div>
  );
}
