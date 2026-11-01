import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { FilterIcon } from "../components/common/Icons";
import {
  ActiveFilterChips,
  type ActiveFilterChip,
} from "../components/discovery/ActiveFilterChips";
import {
  FilterPanel,
  type DirectoryFilterKey,
} from "../components/discovery/FilterPanel";
import { MobileFilterDrawer } from "../components/discovery/MobileFilterDrawer";
import { SearchBar } from "../components/discovery/SearchBar";
import { SmartDiscovery } from "../components/discovery/SmartDiscovery";
import { SortControl } from "../components/discovery/SortControl";
import { PlantGrid } from "../components/plants/PlantGrid";
import { plants } from "../data/plants";
import { plantCategories } from "../data/categories";
import { regions } from "../data/regions";
import type {
  Climate,
  Habitat,
  PlantCategory,
  PlantFilters,
  PlantSort,
  PlantType,
  TraditionalUseCategory,
} from "../types/plant";
import { searchAndSortPlants } from "../utils/plantSearch";
import { useLanguage } from "../context/useLanguage";

const uniqueSorted = (values: string[]) =>
  [...new Set(values)].sort((left, right) => left.localeCompare(right));

const categories = uniqueSorted(plants.map((plant) => plant.category));
const plantTypes = uniqueSorted(plants.map((plant) => plant.plantType));
const habitats = uniqueSorted(plants.flatMap((plant) => plant.habitat));
const climates = uniqueSorted(plants.flatMap((plant) => plant.climate));
const usedRegionIds = new Set(plants.flatMap((plant) => plant.regions));
const regionOptions = regions.filter((region) => usedRegionIds.has(region.id));
const regionNameById = new Map(regions.map((region) => [region.id, region.name]));

const filterParamByKey: Record<DirectoryFilterKey, string> = {
  category: "category",
  plantType: "type",
  region: "region",
  habitat: "habitat",
  climate: "climate",
};

export function PlantsPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const filters: PlantFilters = {
    query: searchParams.get("q") || undefined,
    category: (searchParams.get("category") || undefined) as
      | PlantCategory
      | undefined,
    plantType: (searchParams.get("type") || undefined) as
      | PlantType
      | undefined,
    region: searchParams.get("region") || undefined,
    habitat: (searchParams.get("habitat") || undefined) as Habitat | undefined,
    climate: (searchParams.get("climate") || undefined) as Climate | undefined,
    traditionalUse: (searchParams.get("use") || undefined) as
      | TraditionalUseCategory
      | undefined,
  };
  const sort = (searchParams.get("sort") || "featured") as PlantSort;
  const selectedGroupId = searchParams.get("group");
  const selectedGroup = plantCategories.find(
    (definition) => definition.id === selectedGroupId && definition.kind === "curated",
  );

  const results = searchAndSortPlants(plants, filters, sort).filter(
    (plant) => !selectedGroup || selectedGroup.plantIds?.includes(plant.id),
  );

  const setParameter = useCallback(
    (key: string, value: string) => {
      const nextParams = new URLSearchParams(searchParamsRef.current);
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
      searchParamsRef.current = nextParams;
      startTransition(() =>
        setSearchParams(nextParams, { replace: true }),
      );
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (key: DirectoryFilterKey, value: string) =>
      setParameter(filterParamByKey[key], value),
    [setParameter],
  );

  const clearAll = useCallback(() => {
    const nextParams = new URLSearchParams();
    searchParamsRef.current = nextParams;
    startTransition(() => setSearchParams(nextParams, { replace: true }));
  }, [setSearchParams]);

  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);

  const chips: ActiveFilterChip[] = [
    ...(filters.query
      ? [
          {
            key: "query",
            label: `${t("Search")}: “${filters.query}”`,
            onRemove: () => setParameter("q", ""),
          },
        ]
      : []),
    ...(filters.category
      ? [
          {
            key: "category",
            label: t(filters.category),
            onRemove: () => setParameter("category", ""),
          },
        ]
      : []),
    ...(filters.plantType
      ? [
          {
            key: "plantType",
            label: t(filters.plantType),
            onRemove: () => setParameter("type", ""),
          },
        ]
      : []),
    ...(filters.region
      ? [
          {
            key: "region",
            label: t(regionNameById.get(filters.region) ?? filters.region),
            onRemove: () => setParameter("region", ""),
          },
        ]
      : []),
    ...(filters.habitat
      ? [
          {
            key: "habitat",
            label: t(filters.habitat),
            onRemove: () => setParameter("habitat", ""),
          },
        ]
      : []),
    ...(filters.climate
      ? [
          {
            key: "climate",
            label: t(filters.climate),
            onRemove: () => setParameter("climate", ""),
          },
        ]
      : []),
    ...(filters.traditionalUse
      ? [
          {
            key: "traditionalUse",
            label: filters.traditionalUse,
            onRemove: () => setParameter("use", ""),
          },
        ]
      : []),
    ...(selectedGroup
      ? [{
          key: "group",
            label: t(selectedGroup.label),
          onRemove: () => setParameter("group", ""),
        }]
      : []),
  ];

  const renderFilterPanel = (idPrefix: string) => (
    <FilterPanel
      idPrefix={idPrefix}
      values={{
        category: filters.category ?? "",
        plantType: filters.plantType ?? "",
        region: filters.region ?? "",
        habitat: filters.habitat ?? "",
        climate: filters.climate ?? "",
      }}
      options={{
        categories: categories.map((value) => ({ value, label: value })),
        plantTypes: plantTypes.map((value) => ({ value, label: value })),
        regions: regionOptions.map((region) => ({
          value: region.id,
          label: region.name,
        })),
        habitats: habitats.map((value) => ({ value, label: value })),
        climates: climates.map((value) => ({ value, label: value })),
      }}
      onChange={setFilter}
    />
  );

  return (
    <>
      <section className="directory-hero" aria-labelledby="directory-title">
        <div className="container directory-hero__inner">
          <div className="directory-hero__copy">
          <p className="eyebrow">{t("Plant directory")}</p>
          <h1 id="directory-title">{t("Find a plant worth knowing.")}</h1>
          <p>{t("Search by familiar, scientific, or local name—or follow the climate, habitat, and region where a plant belongs.")}</p>
          </div>
          <SearchBar
            value={filters.query ?? ""}
            resultCount={results.length}
            onChange={(value) => setParameter("q", value)}
          />
        </div>
      </section>

      <section id="directory-results" className="directory" aria-label={t("Plant directory")}>
        <div className="container">
          <div className="directory-toolbar">
            <button
              className="button button--secondary directory-toolbar__filter"
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FilterIcon /> {t("Filters")}
              {chips.length > 0 ? (
                <span className="filter-count">{chips.length}</span>
              ) : null}
            </button>
            <p className="directory-toolbar__summary">
              {t("Showing")} <strong>{results.length}</strong> {t("of")} {plants.length} {t("plants")}
            </p>
            <SortControl
              value={sort}
              onChange={(value) => setParameter("sort", value)}
            />
          </div>

          <ActiveFilterChips chips={chips} onClear={clearAll} />

          <div className="directory-layout">
            <aside className="directory-sidebar" aria-label={t("Filter plants")}>
              <div className="directory-sidebar__heading">
                <div>
                  <p className="eyebrow">{t("Refine")}</p>
                  <h2>{t("Filters")}</h2>
                </div>
                {chips.length > 0 ? (
                  <button className="text-button" type="button" onClick={clearAll}>
                    {t("Clear")}
                  </button>
                ) : null}
              </div>
              {renderFilterPanel("desktop-filter")}
            </aside>

            <div
              className={`directory-results${isPending ? " directory-results--pending" : ""}`}
              aria-busy={isPending}
            >
              {isPending ? (
                <p className="directory-updating" role="status">{t("Updating plant results…")}</p>
              ) : null}
              {results.length > 0 ? (
                <PlantGrid plants={results} prioritizeFirst={3} />
              ) : (
                <EmptyState
                  title="No plants found"
                  description="Try another name or remove one of the active filters to widen your search."
                  action={
                    <button
                      className="button button--primary"
                      type="button"
                      onClick={clearAll}
                    >
                      Clear filters
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <SmartDiscovery />

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={closeMobileFilters}
      >
        {renderFilterPanel("mobile-filter")}
        {chips.length > 0 ? (
          <button
            className="text-button filter-drawer__clear"
            type="button"
            onClick={clearAll}
          >
            Clear all filters
          </button>
        ) : null}
      </MobileFilterDrawer>
    </>
  );
}
