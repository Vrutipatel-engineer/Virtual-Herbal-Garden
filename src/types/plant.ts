import type { PlantImageAsset } from "./images";

export type PlantCategory =
  | "Medicinal"
  | "Aromatic"
  | "Culinary"
  | "Nutritive";

export type PlantType = "Tree" | "Shrub" | "Herb" | "Flower" | "Climber";

export type Habitat =
  | "Tropical forest"
  | "Dry woodland"
  | "Grassland"
  | "Wetland"
  | "Home garden"
  | "Cultivated field"
  | "Hillside";

export type Climate =
  | "Tropical"
  | "Subtropical"
  | "Temperate"
  | "Arid"
  | "Humid";

export type TraditionalUseCategory =
  | "Daily wellness"
  | "Culinary tradition"
  | "Skin care"
  | "Hair care"
  | "Seasonal comfort"
  | "Mindful living";

export interface TraditionalUse {
  category: TraditionalUseCategory;
  summary: string;
}

export interface CultivationGuide {
  soil: string;
  water: string;
  sunlight: string;
  climate: string;
  propagation: string;
}

export interface Plant {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  localNames: string[];
  category: PlantCategory;
  plantType: PlantType;
  family: string;
  regions: string[];
  habitat: Habitat[];
  climate: Climate[];
  description: string;
  traditionalUses: TraditionalUse[];
  characteristics: string[];
  cultivation: CultivationGuide;
  interestingFacts: string[];
  image: PlantImageAsset;
  images: PlantImageAsset[];
  relatedPlantIds: string[];
  featured: boolean;
}

export interface PlantFilters {
  query?: string;
  category?: PlantCategory;
  plantType?: PlantType;
  region?: string;
  habitat?: Habitat;
  climate?: Climate;
  traditionalUse?: TraditionalUseCategory;
}

export type PlantSort = "name-asc" | "name-desc" | "featured";
