import { plantById, plantBySlug, plants } from "../data/plants";

export const getPlantById = (id: string) => plantById.get(id);
export const getPlantBySlug = (slug: string) => plantBySlug.get(slug);
export const getFeaturedPlants = () => plants.filter((plant) => plant.featured);

export { filterPlants, matchesPlantQuery, searchAndSortPlants, sortPlants } from "./plantSearch";
export { getPlantStatistics } from "./plantStats";
export { getSimilarPlants, scorePlantSimilarity } from "./similarPlants";
export { getObjectPosition, getPlantImage, isImageReady } from "./plantImages";
