import type { Region } from "../types/content";
import type { Plant } from "../types/plant";

export interface DataValidationIssue {
  plantId?: string;
  message: string;
}

export const validatePlantData = (
  items: Plant[],
  availableRegions: Region[],
): DataValidationIssue[] => {
  const issues: DataValidationIssue[] = [];
  const plantIds = new Set(items.map((plant) => plant.id));
  const regionIds = new Set(availableRegions.map((region) => region.id));

  if (plantIds.size !== items.length) {
    issues.push({ message: "Plant IDs must be unique." });
  }

  if (new Set(items.map((plant) => plant.slug)).size !== items.length) {
    issues.push({ message: "Plant slugs must be unique." });
  }

  for (const plant of items) {
    if (!plant.story.origin.trim() || !plant.story.culturalContext.trim()) {
      issues.push({
        plantId: plant.id,
        message: "Plant Story origin and cultural context are required.",
      });
    }

    if (!plant.image.alt.trim()) {
      issues.push({ plantId: plant.id, message: "Primary image needs alt text." });
    }

    for (const role of ["hero", "garden"] as const) {
      if (!plant.images.some((image) => image.role === role)) {
        issues.push({
          plantId: plant.id,
          message: `Missing ${role} image metadata.`,
        });
      }
    }

    for (const relatedId of plant.relatedPlantIds) {
      if (!plantIds.has(relatedId)) {
        issues.push({
          plantId: plant.id,
          message: `Related plant "${relatedId}" does not exist.`,
        });
      }
    }

    for (const regionId of plant.regions) {
      if (!regionIds.has(regionId)) {
        issues.push({
          plantId: plant.id,
          message: `Region "${regionId}" does not exist.`,
        });
      }
    }
  }

  return issues;
};
