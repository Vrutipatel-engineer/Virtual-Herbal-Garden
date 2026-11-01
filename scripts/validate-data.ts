import {
  discoveryPaths,
  garden3dPlacements,
  gardenPlacements,
  gardenSceneModels,
  plants,
  regions,
} from "../src/data/index";
import type {
  Climate,
  Habitat,
  PlantCategory,
  PlantFilters,
  PlantType,
  TraditionalUseCategory,
} from "../src/types/plant";
import { filterPlants } from "../src/utils/plantSearch";
import { validatePlantData } from "../src/utils/validatePlantData";

const issues = validatePlantData(plants, regions);
const plantIds = new Set(plants.map((plant) => plant.id));

for (const placement of gardenPlacements) {
  if (!plantIds.has(placement.plantId)) {
    issues.push({
      plantId: placement.plantId,
      message: "Garden placement references an unknown plant.",
    });
  }
}

const garden3dIds = new Set<string>();
const gardenSceneModelIds = new Set<string>();

for (const asset of gardenSceneModels) {
  if (gardenSceneModelIds.has(asset.id)) {
    issues.push({ message: `Duplicate 3D scene asset ID "${asset.id}".` });
  }
  gardenSceneModelIds.add(asset.id);

  if (!asset.model.src.trim() || !asset.model.src.toLowerCase().endsWith(".glb")) {
    issues.push({ message: `3D scene asset "${asset.id}" must reference a GLB model.` });
  }
}

for (const placement of garden3dPlacements) {
  if (!plantIds.has(placement.plantId)) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden placement references an unknown plant.",
    });
  }

  if (garden3dIds.has(placement.id)) {
    issues.push({ message: `Duplicate 3D garden placement ID "${placement.id}".` });
  }
  garden3dIds.add(placement.id);

  if (!placement.model.procedural && (!placement.model.src.trim() || !placement.model.src.toLowerCase().endsWith(".glb"))) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden model source must reference a GLB asset.",
    });
  }

  for (const candidate of [
    ...(placement.model.lods ?? []),
    ...(placement.model.fallback ? [placement.model.fallback] : []),
  ]) {
    if (!candidate.trim() || !candidate.toLowerCase().endsWith(".glb")) {
      issues.push({
        plantId: placement.plantId,
        message: "3D garden LOD and fallback sources must reference GLB assets.",
      });
    }
  }

  const transformValues = [
    ...placement.transform.position,
    ...placement.transform.rotation,
    placement.transform.scale,
  ];
  if (!transformValues.every(Number.isFinite) || placement.transform.scale <= 0) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden transform values must be finite and scale must be positive.",
    });
  }

  if (placement.interaction.radius <= 0 || placement.interaction.labelHeight < 0) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden interaction radius must be positive and label height cannot be negative.",
    });
  }

  if (placement.collider.size.some((value) => !Number.isFinite(value) || value < 0)) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden collider sizes must be finite, non-negative values.",
    });
  }

  const [colliderX, colliderY, colliderZ] = placement.collider.size;
  const colliderHasValidShape =
    (placement.collider.type === "box" && colliderX > 0 && colliderY > 0 && colliderZ > 0) ||
    (placement.collider.type === "sphere" && colliderX > 0) ||
    (placement.collider.type === "capsule" && colliderX > 0 && colliderY > 0);

  if (!colliderHasValidShape) {
    issues.push({
      plantId: placement.plantId,
      message: `3D garden ${placement.collider.type} collider has invalid dimensions.`,
    });
  }

  if (
    placement.collider.offset &&
    placement.collider.offset.some((value) => !Number.isFinite(value))
  ) {
    issues.push({
      plantId: placement.plantId,
      message: "3D garden collider offset values must be finite.",
    });
  }
}

for (const region of regions) {
  if (!plants.some((plant) => plant.regions.includes(region.id))) {
    issues.push({ message: `Region "${region.id}" has no associated plants.` });
  }
}

for (const path of discoveryPaths) {
  const filters: PlantFilters = {
    category: path.filters.category as PlantCategory | undefined,
    plantType: path.filters.type as PlantType | undefined,
    region: path.filters.region,
    habitat: path.filters.habitat as Habitat | undefined,
    climate: path.filters.climate as Climate | undefined,
    traditionalUse: path.filters.use as TraditionalUseCategory | undefined,
  };

  if (filterPlants(plants, filters).length === 0) {
    issues.push({ message: `Discovery path "${path.id}" returns no plants.` });
  }
}

if (issues.length > 0) {
  console.error("Plant data validation failed:");
  for (const issue of issues) {
    console.error(`- ${issue.plantId ? `[${issue.plantId}] ` : ""}${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Plant data valid: ${plants.length} plants, ${regions.length} regions, ${discoveryPaths.length} discovery paths, ${gardenPlacements.length} illustration placements, ${gardenSceneModels.length} modular scene assets, ${garden3dPlacements.length} interactive 3D placements.`,
  );
}
