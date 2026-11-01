import type { Plant } from "../../types/plant";
import { PlantCard } from "./PlantCard";

interface PlantGridProps {
  plants: Plant[];
  prioritizeFirst?: number;
}

export function PlantGrid({ plants, prioritizeFirst = 0 }: PlantGridProps) {
  return (
    <div className="plant-grid">
      {plants.map((plant, index) => (
        <PlantCard
          key={plant.id}
          plant={plant}
          priority={index < prioritizeFirst}
        />
      ))}
    </div>
  );
}
