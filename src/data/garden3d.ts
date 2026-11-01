import type {
  GardenDecorationPlacement,
  GardenPlacement,
  GardenSceneAsset,
} from "../types/garden";

const productionModelRoot = "/models/garden/production";
const gardenPropRoot = `${productionModelRoot}/props`;

const forestTreeSpecs = [
  { id: "apple-tree", species: "apple", position: [-9.2, 0, -8.7], scale: 0.9, rotation: 0.18 },
  { id: "ash-tree", species: "ash", position: [-1.5, 0, -10.1], scale: 0.88, rotation: -0.25 },
  { id: "cherry-tree", species: "cherry", position: [8.9, 0, -9.0], scale: 0.88, rotation: 0.5 },
  { id: "holly-tree", species: "holly", position: [10.0, 0, -1.0], scale: 0.86, rotation: -0.42 },
  { id: "birch-tree", species: "birch", position: [-10.0, 0, 1.0], scale: 0.86, rotation: 0.25 },
  { id: "maple-tree", species: "maple", position: [-8.2, 0, 8.8], scale: 0.84, rotation: 0.45 },
  { id: "oak-tree", species: "oak", position: [8.1, 0, 8.7], scale: 0.84, rotation: -0.2 },
] as const;

const forestTreePlacements: GardenPlacement[] = forestTreeSpecs.map((tree) => ({
  kind: "interactive-plant",
  id: `forest-${tree.species}-tree`,
  plantId: tree.id,
  model: {
    src: `${productionModelRoot}/decorations/forest-${tree.species}-tree-v1-optimized.glb`,
    lods: [`${productionModelRoot}/decorations/forest-${tree.species}-tree-v1-optimized.glb`],
    fallback: `${productionModelRoot}/decorations/forest-${tree.species}-tree-v1-optimized.glb`,
  },
  transform: {
    position: [...tree.position] as [number, number, number],
    rotation: [0, tree.rotation, 0],
    scale: tree.scale,
  },
  interaction: { radius: 8, labelHeight: 2.4 },
  collider: {
    type: "capsule",
    size: [0.26, 1.45, 0],
    offset: [0, 1.45, 0],
  },
  windProfile: "tree",
  render: { minimumQuality: "low", castShadow: true, receiveShadow: true },
}));

export const gardenSceneModels: GardenSceneAsset[] = [
  {
    id: "garden-terrain",
    role: "terrain",
    model: { src: `${productionModelRoot}/terrain-pbr-v2.glb` },
    render: {
      minimumQuality: "low",
      castShadow: false,
      receiveShadow: true,
    },
  },
  {
    id: "garden-pathways",
    role: "pathways",
    model: { src: `${productionModelRoot}/pathways.glb` },
    render: {
      minimumQuality: "low",
      castShadow: false,
      receiveShadow: true,
    },
  },
];

export const garden3dPlacements: GardenPlacement[] = [
  {
    kind: "interactive-plant",
    id: "poc-tulsi-bed",
    plantId: "tulsi",
    model: {
      src: `${productionModelRoot}/plants/tulsi-real-v1.glb`,
      lods: [`${productionModelRoot}/plants/tulsi-real-v1.glb`],
      fallback: `${productionModelRoot}/plants/tulsi-real-v1.glb`,
    },
    transform: {
      position: [-3.2, 0, -4],
      rotation: [0, 0, 0],
      scale: 1,
    },
    interaction: {
      radius: 6.5,
      labelHeight: 2.3,
    },
    collider: {
      type: "capsule",
      size: [0.75, 0.82, 0],
      offset: [0, 0.84, 0],
    },
    windProfile: "herb",
    render: {
      minimumQuality: "low",
      castShadow: true,
      receiveShadow: true,
    },
  },
  {
    kind: "interactive-plant",
    id: "poc-aloe-bed",
    plantId: "aloe-vera",
    model: {
      src: `${productionModelRoot}/plants/aloe-vera-real-v2.glb`,
      nodeName: "Plant_Aloe",
      lods: [`${productionModelRoot}/plants/aloe-vera-real-v2.glb`],
      fallback: `${productionModelRoot}/plants/aloe-vera-real-v2.glb`,
    },
    transform: {
      position: [3, 0, 5.5],
      rotation: [0, 0, 0],
      scale: 1,
    },
    interaction: {
      radius: 6,
      labelHeight: 0.65,
    },
    collider: {
      type: "sphere",
      size: [0.5, 0, 0],
      offset: [0, 0.38, 0],
    },
    windProfile: "herb",
    render: {
      minimumQuality: "low",
      castShadow: true,
      receiveShadow: true,
    },
  },
  {
    kind: "interactive-plant",
    id: "poc-hibiscus-bed",
    plantId: "hibiscus",
    model: {
      src: `${productionModelRoot}/plants/hibiscus-real-v1.glb`,
      lods: [`${productionModelRoot}/plants/hibiscus-real-v1.glb`],
      fallback: `${productionModelRoot}/plants/hibiscus-real-v1.glb`,
    },
    transform: {
      position: [4.6, 0, -6],
      rotation: [0, 0, 0],
      scale: 1,
    },
    interaction: {
      radius: 7,
      labelHeight: 1.65,
    },
    collider: {
      type: "capsule",
      size: [0.38, 0.72, 0],
      offset: [0, 1.1, 0],
    },
    windProfile: "flower",
    render: {
      minimumQuality: "low",
      castShadow: true,
      receiveShadow: true,
    },
  },
  {
    kind: "interactive-plant",
    id: "neem-tree-west",
    plantId: "neem",
    model: {
      src: `${productionModelRoot}/decorations/neem-tree-real-v1.glb`,
      lods: [`${productionModelRoot}/decorations/neem-tree-real-v1.glb`],
      fallback: `${productionModelRoot}/decorations/neem-tree-real-v1.glb`,
    },
    transform: {
      // The source includes exposed buttress roots. Sink its lower root mass into
      // the terrain so the trunk reads as planted rather than floating.
      position: [-5.4, -1.2, 2],
      rotation: [0, 0.36, 0],
      scale: 0.38,
    },
    interaction: {
      radius: 10,
      labelHeight: 1.6,
    },
    collider: {
      type: "sphere",
      size: [0.62, 0, 0],
      offset: [0, 1.2, 0],
    },
    windProfile: "tree",
    render: {
      minimumQuality: "low",
      castShadow: true,
      receiveShadow: true,
    },
  },
  {
    kind: "interactive-plant",
    id: "lemongrass-bed-east",
    plantId: "lemongrass",
    model: {
      src: `${productionModelRoot}/plants/lemongrass-real-v1.glb`,
      lods: [`${productionModelRoot}/plants/lemongrass-real-v1.glb`],
      fallback: `${productionModelRoot}/plants/lemongrass-real-v1.glb`,
    },
    transform: {
      // The Sketchfab source is authored at a small scale. This scale brings
      // the dense grass clump to a readable, near-meter garden specimen.
      position: [8.4, 0.06, -3.2],
      rotation: [0, 0.7, 0],
      scale: 11,
    },
    interaction: {
      radius: 6.5,
      labelHeight: 1.05,
    },
    collider: {
      type: "box",
      // GardenPlant applies the model's 11x scale to its rigid body too, so
      // keep these local collider values small to match the visible grass tuft.
      size: [0.05, 0.035, 0.05],
      offset: [0, 0.04, 0],
    },
    windProfile: "herb",
    render: {
      minimumQuality: "low",
      castShadow: true,
      receiveShadow: true,
    },
  },
  ...forestTreePlacements,
];

/** Reuse one merged fence panel at meter-spaced offsets around the fixed garden edge. */
const fenceOffsets = [-10.77, -8.62, -6.46, -4.31, -2.15, 0, 2.15, 4.31, 6.46, 8.62, 10.77];
const fenceModelSrc = `${gardenPropRoot}/picket-fence-original-exterior-cad-optimized.glb`;
const fenceRender = { minimumQuality: "low", castShadow: false, receiveShadow: true } as const;
const fenceScale = 0.001; // The CAD-to-GLB export stores coordinates in millimetres.
const fenceLine = 11.3;
const fencePlacement = (
  id: string,
  position: [number, number, number],
  rotation: [number, number, number],
): GardenDecorationPlacement => ({
  kind: "decoration",
  id,
  model: { src: fenceModelSrc },
  transform: { position, rotation, scale: fenceScale },
  // Collider values are in the GLB's millimetre coordinate space and inherit
  // the 0.001 rigid-body scale, matching the visible 2.155 m fence panel.
  collider: { type: "box", size: [1077.5, 608, 77.5], offset: [0, 608, 0] },
  render: fenceRender,
});

const fencePlacements: GardenDecorationPlacement[] = [
  ...fenceOffsets.map((offset) =>
    fencePlacement(`fence-north-${offset}`, [offset, 0, -fenceLine], [0, 0, 0]),
  ),
  ...fenceOffsets.map((offset) =>
    fencePlacement(`fence-west-${offset}`, [-fenceLine, 0, offset], [0, Math.PI / 2, 0]),
  ),
  ...fenceOffsets.map((offset) =>
    fencePlacement(`fence-east-${offset}`, [fenceLine, 0, offset], [0, Math.PI / 2, 0]),
  ),
  ...fenceOffsets
    // Keep the center panel out for the gate, while retaining the two adjacent
    // panels so the opening stays close to the gate's real-world width.
    .filter((offset) => offset !== 0)
    .map((offset) =>
      fencePlacement(`fence-south-${offset}`, [offset, 0, fenceLine], [0, 0, 0]),
    ),
];

const ridgeScales = [
  [2.8, 2.15, 2.05], [3.15, 2.65, 2.2], [2.65, 1.8, 2.25], [3.25, 2.4, 2.1],
  [2.9, 2.75, 1.95], [3.3, 2.0, 2.25], [2.7, 2.3, 2.3], [3.1, 2.55, 2.0],
] as const;

const mountainRing: GardenDecorationPlacement[] = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  const radius = 30.5 + (index % 2) * 1.1;
  const modelScale = ridgeScales[index % ridgeScales.length];
  return {
    kind: "decoration",
    id: `distant-mountain-${index + 1}`,
    model: { src: `${productionModelRoot}/environment/mountainside-distant.glb` },
    transform: {
      position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius],
      rotation: [0, angle + Math.PI, 0],
      scale: 1,
    },
    modelScale: [...modelScale],
    render: { minimumQuality: "low", castShadow: false, receiveShadow: false },
  };
});

/**
 * Non-interactive environmental models. These remain independent from the plant
 * directory, so scenery can never accidentally represent a medicinal profile.
 */
export const gardenDecorations: GardenDecorationPlacement[] = [
  ...mountainRing,
  ...fencePlacements,
  {
    kind: "decoration",
    id: "garden-entry-gate",
    model: { src: `${gardenPropRoot}/garden-picket-gate-optimized.glb` },
    transform: { position: [0, 0, fenceLine], rotation: [0, 0, 0], scale: 1 },
    render: { minimumQuality: "low", castShadow: true, receiveShadow: true },
  },
  {
    kind: "decoration",
    id: "garden-bench-north",
    model: { src: `${gardenPropRoot}/slatted-park-bench-optimized.glb` },
    // Keep the north bench beside the path, clear of the centerline and plants.
    transform: { position: [5.8, 0, -9], rotation: [0, Math.PI / 2, 0], scale: 1 },
    collider: { type: "box", size: [0.78, 0.47, 0.34], offset: [0, 0.47, 0] },
    render: { minimumQuality: "low", castShadow: true, receiveShadow: true },
  },
  {
    kind: "decoration",
    id: "garden-bench-west",
    model: { src: `${gardenPropRoot}/slatted-park-bench-optimized.glb` },
    transform: { position: [-9.4, 0, -2.8], rotation: [0, Math.PI / 2, 0], scale: 1 },
    collider: { type: "box", size: [0.78, 0.47, 0.34], offset: [0, 0.47, 0] },
    render: { minimumQuality: "low", castShadow: true, receiveShadow: true },
  },
  {
    kind: "decoration",
    id: "garden-bench-east",
    model: { src: `${gardenPropRoot}/slatted-park-bench-optimized.glb` },
    transform: { position: [9.4, 0, 2.8], rotation: [0, -Math.PI / 2, 0], scale: 1 },
    collider: { type: "box", size: [0.78, 0.47, 0.34], offset: [0, 0.47, 0] },
    render: { minimumQuality: "low", castShadow: true, receiveShadow: true },
  },
  ...[
    [-1.45, 0, 10.1],
    [1.45, 0, 10.1],
    [-10.2, 0, -5.5],
    [10.2, 0, 5.5],
    [2.8, 0, 7],
    [-2.8, 0, 1.5],
    [2.8, 0, -4],
    [-2.8, 0, -9],
  ].map(([x, y, z], index): GardenDecorationPlacement => ({
    kind: "decoration",
    id: `garden-lantern-${index + 1}`,
    model: { src: `${gardenPropRoot}/post-top-lantern-optimized.glb` },
    transform: { position: [x, y, z], rotation: [0, 0, 0], scale: 1 },
    render: { minimumQuality: "low", castShadow: false, receiveShadow: true },
  })),
];

export const garden3dPlacementById = new Map(
  garden3dPlacements.map((placement) => [placement.id, placement]),
);

export const garden3dPlacementsByPlantId = garden3dPlacements.reduce(
  (placementsByPlant, placement) => {
    const existingPlacements = placementsByPlant.get(placement.plantId) ?? [];
    placementsByPlant.set(placement.plantId, [...existingPlacements, placement]);
    return placementsByPlant;
  },
  new Map<string, GardenPlacement[]>(),
);
