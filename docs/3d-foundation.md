# 3D Garden Foundation

Phase 4 uses a deliberately small, React-compatible 3D stack. The garden remains isolated behind the lazy-loaded `/garden` route so the normal editorial pages do not eagerly download the renderer or physics runtime.

## Runtime responsibilities

| Package | Responsibility |
| --- | --- |
| `three` | WebGL rendering primitives and scene math |
| `@react-three/fiber` | React 19 renderer and frame lifecycle |
| `@react-three/drei` | GLB loading, sky, and focused helpers |
| `@react-three/rapier` | WASM physics, player body, boundaries, and collisions |

`@react-three/postprocessing` is intentionally deferred. It will only be added after the full scene has a measured visual need and enough desktop/mobile performance headroom.

## Asset boundary

- Editable Blender sources live under `assets-3d/`.
- Browser-ready models live under `public/models/garden/`.
- Runtime model paths are supplied through garden data, never embedded inside reusable render components.
- Important Blender object names are treated as an interface because wind and interaction code may target them.
- No external 3D asset provider is selected by this foundation.

The automated modular build is documented in [blender-production-pipeline.md](./blender-production-pipeline.md).

## Model commands

Validate every runtime garden model with the official Khronos validator used by glTF Transform:

```bash
pnpm validate:models
```

Inspect geometry, materials, texture sizes, and draw-call-related model structure:

```bash
pnpm inspect:model -- public/models/garden/production/environment.glb
```

Create a separate optimized candidate while preserving the named scene hierarchy:

```bash
pnpm optimize:model -- assets-3d/exports/environment.glb artifacts/models/environment.optimized.glb
```

The optimizer refuses in-place overwrites. It uses Meshopt geometry compression, WebP texture compression where textures exist, and automatically validates the result. An optimized candidate must still pass visual, interaction, and loading QA before replacing a runtime model.

## Export checklist

1. Keep real-world scale consistent and apply transforms in Blender.
2. Preserve stable names for interactive or wind-animated groups.
3. Export GLB with materials and referenced textures packed.
4. Run `pnpm validate:models` after copying the runtime export.
5. Inspect large or complex models before choosing optimization settings.
6. Test the final runtime file on desktop and mobile; validation alone does not confirm visual correctness.
