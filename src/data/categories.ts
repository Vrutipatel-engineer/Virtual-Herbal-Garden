import type { PlantCategoryDefinition } from "../types/content";

export const plantCategories: PlantCategoryDefinition[] = [
  {
    id: "ecological",
    label: "Ecological",
    description: "Plants and trees valued for habitat, food webs, shade, and landscape roles.",
    kind: "category",
    value: "Ecological",
  },
  {
    id: "medicinal",
    label: "Medicinal",
    description: "Plants documented in traditional wellness practices.",
    kind: "category",
    value: "Medicinal",
  },
  {
    id: "aromatic",
    label: "Aromatic",
    description: "Fragrant plants valued for their distinctive natural oils.",
    kind: "category",
    value: "Aromatic",
  },
  {
    id: "herbal",
    label: "Herbal",
    description: "Plants valued in Indian home herbal, food, and garden traditions.",
    kind: "curated",
    value: "herbal",
    plantIds: ["tulsi", "neem", "aloe-vera", "turmeric", "moringa", "hibiscus"],
  },
  {
    id: "trees",
    label: "Trees",
    description: "Long-lived botanical anchors with layered ecological roles.",
    kind: "plantType",
    value: "Tree",
  },
  {
    id: "shrubs",
    label: "Shrubs",
    description: "Woody, branching plants suited to diverse garden habitats.",
    kind: "plantType",
    value: "Shrub",
  },
  {
    id: "herbs",
    label: "Herbs",
    description: "Soft-stemmed plants central to home gardens and traditions.",
    kind: "plantType",
    value: "Herb",
  },
  {
    id: "flowers",
    label: "Flowers",
    description: "Flowering species known for beauty and cultural significance.",
    kind: "curated",
    value: "flowers",
    plantIds: ["hibiscus", "tulsi"],
  },
];
