import type { PlantImageAsset } from "./images";

export type PlantCategory =
  | "Medicinal"
  | "Aromatic"
  | "Culinary"
  | "Nutritive"
  | "Ecological";

export type PlantType = "Tree" | "Shrub" | "Herb" | "Flower" | "Climber";

export type Habitat =
  | "Tropical forest"
  | "Dry woodland"
  | "Grassland"
  | "Wetland"
  | "Home garden"
  | "Cultivated field"
  | "Hillside"
  | "Temperate woodland"
  | "Woodland edge"
  | "Orchard";

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

export interface GardenBenefit {
  category: string;
  summary: string;
}

export interface PlantReference {
  label: string;
  url: string;
}

export interface CultivationGuide {
  soil: string;
  water: string;
  sunlight: string;
  climate: string;
  propagation: string;
}

export interface PlantStoryContent {
  origin: string;
  culturalContext: string;
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
  story: PlantStoryContent;
  traditionalUses: TraditionalUse[];
  /** Landscape and wildlife value, separate from medicinal or traditional uses. */
  gardenBenefits?: GardenBenefit[];
  /** References for educational facts shown on the plant profile. */
  references?: PlantReference[];
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
