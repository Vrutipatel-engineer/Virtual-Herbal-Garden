export interface PlantCategoryDefinition {
  id: string;
  label: string;
  description: string;
  kind: "category" | "plantType" | "curated";
  value: string;
  /** Optional exact membership for discovery groups that span plant categories/types. */
  plantIds?: string[];
}

export interface Region {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  climateNote: string;
}

export type ResourceCategory =
  | "Foundations"
  | "Identification"
  | "Cultivation"
  | "Botany"
  | "Responsible use";

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  readingTime: number;
  featured: boolean;
  sections: EducationalResourceSection[];
}

export interface EducationalResourceSection {
  heading: string;
  paragraphs: string[];
}

export interface DiscoveryPath {
  id: string;
  prompt: string;
  title: string;
  description: string;
  filters: Record<string, string>;
  accent: "leaf" | "earth" | "mist";
}

export type GardenLayer = "background" | "midground" | "foreground";

export interface GardenPlacement {
  plantId: string;
  x: number;
  y: number;
  scale: number;
  depth: number;
  layer: GardenLayer;
  labelPosition: "left" | "right" | "above";
  imageRole: "garden";
}
