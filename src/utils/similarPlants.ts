import type { Plant } from "../types/plant";

const overlapCount = <T,>(left: T[], right: T[]) =>
  left.filter((value) => right.includes(value)).length;

export const scorePlantSimilarity = (source: Plant, candidate: Plant) => {
  if (source.id === candidate.id) return Number.NEGATIVE_INFINITY;

  let score = 0;

  if (source.relatedPlantIds.includes(candidate.id)) score += 8;
  if (source.category === candidate.category) score += 4;
  if (source.plantType === candidate.plantType) score += 3;
  score += overlapCount(source.regions, candidate.regions) * 2;
  score += overlapCount(source.habitat, candidate.habitat) * 2;
  score += overlapCount(source.climate, candidate.climate);
  score += overlapCount(
    source.traditionalUses.map((use) => use.category),
    candidate.traditionalUses.map((use) => use.category),
  );

  return score;
};

export const getSimilarPlants = (
  source: Plant,
  allPlants: Plant[],
  limit = 3,
) =>
  allPlants
    .filter((candidate) => candidate.id !== source.id)
    .map((plant) => ({ plant, score: scorePlantSimilarity(source, plant) }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.plant.commonName.localeCompare(right.plant.commonName),
    )
    .slice(0, limit)
    .map(({ plant }) => plant);
