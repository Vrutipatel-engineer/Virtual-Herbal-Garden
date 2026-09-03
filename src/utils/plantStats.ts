import type { Plant } from "../types/plant";

export interface PlantStatistics {
  totalPlants: number;
  categories: number;
  regions: number;
  families: number;
}

export const getPlantStatistics = (items: Plant[]): PlantStatistics => ({
  totalPlants: items.length,
  categories: new Set(items.map((plant) => plant.category)).size,
  regions: new Set(items.flatMap((plant) => plant.regions)).size,
  families: new Set(items.map((plant) => plant.family)).size,
});
