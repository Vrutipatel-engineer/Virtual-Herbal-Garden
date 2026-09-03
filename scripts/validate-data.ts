import { gardenPlacements, plants, regions } from "../src/data/index";
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

if (issues.length > 0) {
  console.error("Plant data validation failed:");
  for (const issue of issues) {
    console.error(`- ${issue.plantId ? `[${issue.plantId}] ` : ""}${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Plant data valid: ${plants.length} plants, ${regions.length} regions, ${gardenPlacements.length} garden placements.`,
  );
}
