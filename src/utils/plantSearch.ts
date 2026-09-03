import type { Plant, PlantFilters, PlantSort } from "../types/plant";

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();

const includesNormalized = (value: string, query: string) =>
  normalize(value).includes(query);

export const matchesPlantQuery = (plant: Plant, rawQuery: string) => {
  const query = normalize(rawQuery);

  if (!query) {
    return true;
  }

  return [plant.commonName, plant.scientificName, ...plant.localNames].some(
    (name) => includesNormalized(name, query),
  );
};

export const filterPlants = (items: Plant[], filters: PlantFilters) =>
  items.filter((plant) => {
    if (filters.query && !matchesPlantQuery(plant, filters.query)) return false;
    if (filters.category && plant.category !== filters.category) return false;
    if (filters.plantType && plant.plantType !== filters.plantType) return false;
    if (filters.region && !plant.regions.includes(filters.region)) return false;
    if (filters.habitat && !plant.habitat.includes(filters.habitat)) return false;
    if (filters.climate && !plant.climate.includes(filters.climate)) return false;
    if (
      filters.traditionalUse &&
      !plant.traditionalUses.some(
        (use) => use.category === filters.traditionalUse,
      )
    ) {
      return false;
    }

    return true;
  });

export const sortPlants = (items: Plant[], sort: PlantSort) =>
  [...items].sort((left, right) => {
    if (sort === "name-desc") {
      return right.commonName.localeCompare(left.commonName);
    }

    if (sort === "featured") {
      const featuredDifference = Number(right.featured) - Number(left.featured);
      return featuredDifference || left.commonName.localeCompare(right.commonName);
    }

    return left.commonName.localeCompare(right.commonName);
  });

export const searchAndSortPlants = (
  items: Plant[],
  filters: PlantFilters = {},
  sort: PlantSort = "name-asc",
) => sortPlants(filterPlants(items, filters), sort);
