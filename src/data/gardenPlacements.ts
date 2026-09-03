import type { GardenPlacement } from "../types/content";

export const gardenPlacements: GardenPlacement[] = [
  { plantId: "neem", x: 12, y: 38, scale: 1.25, depth: 1, layer: "background", labelPosition: "right", imageRole: "garden" },
  { plantId: "moringa", x: 82, y: 36, scale: 1.15, depth: 1, layer: "background", labelPosition: "left", imageRole: "garden" },
  { plantId: "hibiscus", x: 25, y: 62, scale: 0.9, depth: 2, layer: "midground", labelPosition: "above", imageRole: "garden" },
  { plantId: "ashwagandha", x: 66, y: 60, scale: 0.78, depth: 2, layer: "midground", labelPosition: "right", imageRole: "garden" },
  { plantId: "tulsi", x: 42, y: 73, scale: 0.74, depth: 3, layer: "foreground", labelPosition: "left", imageRole: "garden" },
  { plantId: "lemongrass", x: 88, y: 76, scale: 0.86, depth: 3, layer: "foreground", labelPosition: "left", imageRole: "garden" },
];
