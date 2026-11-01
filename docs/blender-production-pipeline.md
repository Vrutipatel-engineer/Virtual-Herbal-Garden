# Blender Production Pipeline

Phase 4 Step 4 provides a deterministic, script-driven Blender pipeline. The user does not need to open or operate Blender to rebuild the current garden assets.

## Run the pipeline

```bash
pnpm build:garden-assets
```

The launcher locates Blender, runs it in background mode, fails on Python errors, writes the editable source and modular exports, copies browser-ready assets into `public/`, and validates every exported GLB.

If Blender is installed in a non-standard location, set `BLENDER_PATH` to the executable before running the command.

## Script responsibilities

| Script | Responsibility |
| --- | --- |
| `create_garden.py` | Resets/configures Blender and orchestrates the complete build |
| `garden_common.py` | Materials, primitives, collections, transforms, naming, and metadata helpers |
| `build_terrain.py` | Terrain, pathways, planting zones, tree, rocks, and restrained environment props |
| `prepare_plants.py` | Origin-normalized Tulsi, Aloe Vera, and Hibiscus LOD0/LOD1 candidates |
| `create_colliders.py` | Low-complexity ground, boundary, tree, and rock collision proxies |
| `export_glb.py` | Editable source save, modular GLB exports, runtime copies, hashes, and manifest |

## Generated structure

```text
assets-3d/
├── source/
│   └── herbal-garden.blend
└── exports/
    ├── terrain.glb
    ├── pathways.glb
    ├── environment.glb
    ├── colliders.glb
    ├── manifest.json
    └── plants/
        ├── tulsi.glb
        ├── tulsi-lod1.glb
        ├── aloe-vera.glb
        ├── aloe-vera-lod1.glb
        ├── hibiscus.glb
        └── hibiscus-lod1.glb

public/models/garden/production/
└── matching browser-ready copies and manifest
```

The web application loads terrain, pathways, environment, and plant files independently. This keeps replacement, caching, inspection, and future progressive loading manageable.

## Naming and coordinate contract

- Blender source uses metric scale and Z-up coordinates.
- GLB exports use Y-up coordinates for Three.js.
- Standalone plant roots remain at the origin; placement data controls their garden positions.
- Interactive roots retain stable names: `Plant_Tulsi`, `Plant_Aloe`, and `Plant_Hibiscus`.
- Wind targets and collider proxies use stable `Tree_*` and `COLLIDER_*` prefixes.
- Custom glTF extras record asset role, stable asset ID, plant ID where relevant, and LOD level.

## Asset decision gate

Every currently generated model is a project-owned procedural placeholder used to prove the production pipeline. No external botanical model source, license, provider, or CDN has been selected. Photorealistic asset population remains paused until the separately approved asset decision covering accuracy, licensing, polygon budgets, texture budgets, LODs, mobile suitability, visual consistency, and hosting.
