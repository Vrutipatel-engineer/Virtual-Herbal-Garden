# 3D Garden Data Architecture

Phase 4 Step 3 separates plant meaning, 3D placement, reusable rendering, and the source asset. The current prototype still uses one project-generated GLB, but the UI is no longer coupled to that file or to Blender object coordinates.

## Data flow

```text
Plant dataset (`plantId`)
          ↓
3D garden placement data
          ↓
Reusable `GardenPlant`
          ↓
Preferred model / future LOD / fallback
          ↓
Preview, favorite, and `/plants/:id`
```

Plant information remains in `src/data/plants.ts`. `src/data/garden3d.ts` only describes where and how a plant exists in the real-time garden.

## Placement responsibilities

Each interactive placement contains:

- A stable placement ID and an existing plant dataset ID
- A provider-independent model reference
- An optional named node for extracting a plant from a shared GLB
- Reserved LOD and fallback model paths
- Position, rotation, and uniform scale
- Interaction radius and label/focus height
- Box, sphere, or capsule collision metadata
- A plant-type wind profile
- Shadow and minimum-quality rendering metadata

The selected GLB node is normalized at runtime and the placement transform becomes the source of truth. A Blender model can therefore be replaced without moving interaction targets or rewriting preview UI.

## Interactive plants versus decoration

`GardenPlacement` always represents a meaningful plant linked to the educational dataset. `GardenDecorationPlacement` is a separate type for non-interactive trees, stones, background foliage, and later scene dressing. Decorative objects must not appear in the keyboard-accessible plant list or announce themselves as discoverable plants.

## Current prototype

Tulsi, Aloe Vera, and Hibiscus use the new schema. Their visual nodes are extracted from the shared prototype GLB and rendered through `GardenPlant`; the environment copy removes those nodes to prevent duplicates. The component also applies data-driven wind, shadows, transforms, and Rapier colliders.

The two-dimensional `gardenPlacements` dataset is retained separately as illustration metadata and is not used by the real-time 3D scene.

## Validation

`pnpm validate:data` rejects:

- Unknown plant IDs
- Duplicate placement IDs
- Non-GLB model, LOD, or fallback references
- Invalid transforms or non-positive scale
- Invalid interaction distances
- Invalid collider dimensions or offsets

This validation keeps future plant additions consistent before the browser loads them.
