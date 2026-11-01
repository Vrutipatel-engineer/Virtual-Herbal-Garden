# Free Realism Asset Registry

## Approved sourcing policy

The user approved a free-only asset workflow on 2026-10-24.

- Use **CC0** assets without attribution requirements where possible.
- Use **CC-BY** assets only after recording the author, source page, exact license, and required credit.
- Reject assets that are paid, subscription-only, non-commercial, editorial-only, personal-use-only, or lack a clear per-asset license.
- Do not reuse a visually similar plant model for a different botanical species.

## Environment candidates

| Role | Candidate | License | Intended use | Status |
| --- | --- | --- | --- | --- |
| Terrain material | [Forest Ground 01](https://polyhaven.com/a/forrest_ground_01) | CC0 | Soil, leaf litter, moss and small ground detail | Approved source; download at 1K/2K only |
| Natural lighting reference | [Garden Nook HDRI](https://polyhaven.com/a/garden_nook) | CC0 | Blender lighting reference; browser version will use a small optimized derivative or existing procedural sky | Approved source; do not ship 24K original |
| Garden lighting alternative | [Residential Garden HDRI](https://polyhaven.com/a/residential_garden) | CC0 | Soft overcast lighting reference | Approved fallback |

## Botanical-model policy

Botanically accurate Tulsi, Aloe Vera, Hibiscus, Neem and the remaining dataset plants require individual model review. Free download availability alone is not approval. Each candidate must have a visible, compatible license and an appropriate real-world species before it enters the project.

Current rule: prefer CC0. If a high-quality free CC-BY model is selected, add it to `THIRD_PARTY_NOTICES.md` with the creator, model URL, license and attribution text before importing it into Blender.

## Selected botanical source models — import batch 01

**Selection completed: 2026-10-24.** These are source models only, not browser-ready assets. Each will be reviewed inside Blender, reduced into LODs, and fitted with the project's existing collider, hotspot, wind and accessibility metadata before it replaces a current procedural placeholder.

| Plant | Selected source | Creator | License | Why selected | Import treatment |
| --- | --- | --- | --- | --- | --- |
| Tulsi (*Ocimum tenuiflorum*) | [Tulsi Tree on a cement tub](https://sketchfab.com/3d-models/tulsi-tree-on-a-cement-tub-29e20a3ac415461fa12930d04282163c) | Prakash.Chatterjee | CC BY | Human-authored Blender model; 86.9k triangles gives enough source detail and is not AI-generated. | **Imported for inspection only.** Decorative cement pot must be removed. The current plant canopy is sparse, so it is a reference/kitbash candidate, not yet approved to replace the live Tulsi model. |
| Aloe vera | [N031 Aloe Vera — Free version](https://sketchfab.com/3d-models/n031-aloe-vera-free-version-7ce1010147dc411f91d3f6ec0c5e793c) | bimage | CC BY | Photogrammetry source with 4K PBR maps; strongest realism candidate. | Use as a high-detail reference/master only; aggressively reduce its 3.8M-triangle source and downsize textures for runtime. |
| Hibiscus (*Hibiscus rosa-sinensis*) | [Realistic HD Chinese hibiscus (19/20)](https://sketchfab.com/3d-models/realistic-hd-chinese-hibiscus-1920-e6067a7d32eb4ab8bf320eba7363f82a) | PlantCatalog | CC BY | Species is explicitly identified and supplied with LODs; 57.3k triangles is reasonable for a near-field source model. | Keep the flowering shrub; inspect supplied LODs and make browser-specific copies if required. |

### Rejected in this selection

- The 9.8k-triangle Sketchfab Tulsi generated with Meshy: excluded because it is AI-generated and conflicts with the project visual direction.
- Non-commercial assets: excluded because the project needs a portfolio-safe commercial-use path.
- Very low-detail models as a realism source: excluded unless needed later as an explicit distant-vegetation LOD.

### Attribution and download gate

All three selected sources are CC BY, so an attribution notice will be created before a source asset enters the repository. Downloads may require the account holder to sign in to Sketchfab; no login credentials are needed by or shared with the project. The next step is limited to downloading these selected source files and inspecting their actual format, materials, geometry, scale, and embedded license data.

### Tulsi source inspection — 2026-10-24

- Local source: `assets-3d/source/third-party/tulsi-source-v1.glb`
- SHA-256: `6D595823D3D277020CD6B94B4EE43659CD52580E3241C9AC5F5247FADFBF5BB1`
- Downloaded size: 14.6 MB; validated GLB with no errors or warnings.
- Contents: six mesh objects, four PBR material groups, 1K textures, 86,596 source vertices / 86,908 source polygons.
- Visual outcome: included pot is well rendered, but the Tulsi itself is thin and too sparse for the premium near-field garden role. Do not export it to `public/models/` yet.
- Inspection outputs: `artifacts/qa/tulsi-source-inspection.json` and `artifacts/qa/tulsi-source-preview.png`.

## Verified download batch 02 — pending user download

Download only the exact source below. Prefer the smallest **GLB** offering with **1K textures** when the download dialog provides variants. A source is never loaded directly by the browser; it is inspected, cleaned and optimized first.

| Role | Exact source | License | Download choice | Expected project use |
| --- | --- | --- | --- | --- |
| Interactive Aloe vera | [N031 Aloe Vera — Free version](https://sketchfab.com/3d-models/n031-aloe-vera-free-version-7ce1010147dc411f91d3f6ec0c5e793c) by bimage | CC BY | GLB, 1K if shown | Photogrammetry master/reference; make optimized plant-only LODs. |
| Interactive Hibiscus | [Realistic HD Chinese hibiscus (19/20)](https://sketchfab.com/3d-models/realistic-hd-chinese-hibiscus-1920-e6067a7d32eb4ab8bf320eba7363f82a) by PlantCatalog | CC BY | GLB, 1K if shown | Exact *Hibiscus rosa-sinensis* shrub; inspect its supplied LODs. |
| Decorative Neem tree | [Neem Tree](https://sketchfab.com/3d-models/neem-tree-03edef8009d942d3a3db6fa64cecbe56) by Rohit Pawar | CC BY | GLB, 1K if shown | Background tree only after major mesh reduction; source is too dense for direct browser use. |
| Decorative ground vegetation | [Plants Asset Set](https://sketchfab.com/3d-models/plants-asset-set-2edf52774f4d4cde8d8c3a19b8dda205) by Em Marshall | CC BY | GLB, 1K if shown | Grass and small flowers only; never label these as dataset medicinal species. |
| Decorative broadleaf trees | [Various Forest Assets Pack](https://sketchfab.com/3d-models/various-forest-assets-pack-cf138b8eb2d340cda643ed59f824989c) by Dari | CC BY | GLB, 1K if shown | Distant background trees/shrubs only; never label as Neem, Amla, or Moringa. |

### Species intentionally not in batch 02

Ashwagandha, Turmeric, Brahmi, Amla, Mint, Giloy and Moringa still need verified, non-AI, clear-license, botanically appropriate sources. They remain procedural/illustrated or absent from the 3D scene until each is separately verified. Do not substitute a generic plant and present it as one of these species.

## Web budgets

- Texture source downloads: 1K or 2K working resolution only.
- Runtime textures: resize/compress for the final GLB before copying to `public/models/`.
- No raw HDRIs or source texture archives ship to the browser.
- Every imported model receives an optimized GLB, collision proxy and LOD candidate through the existing Blender pipeline.

## Processed runtime assets — 2026-10-24

The following derivatives were made from user-downloaded, approved CC-BY sources. Raw sources remain under `assets-3d/source/third-party/`; only optimized derivatives are served from `public/models/`.

| Asset | Runtime file | Treatment | Result | Live scene role |
| --- | --- | --- | --- | --- |
| Tulsi | `plants/tulsi-real-v1.glb` | Removed an unrelated white helper cube, retained the authentic planter and specimen, grounded its base, then compressed textures/geometry. | 14.6 MB raw → 2.48 MB runtime | Interactive Tulsi hotspot |
| Aloe vera | `plants/aloe-vera-real-v2.glb` | Decimated photogrammetry source, removed the capture ground slab and duplicate plants, then exported the central Aloe as `Plant_Aloe`. | 232.1 MB raw → 2.36 MB runtime | Interactive Aloe hotspot |
| Chinese hibiscus | `plants/hibiscus-real-v1.glb` | Optimized the supplied source while retaining its complete shrub structure. | 6.68 MB raw → 904 KB runtime | Interactive Hibiscus hotspot |
| Neem tree | `decorations/neem-tree-real-v1.glb` | Simplified, combined 3,005 source mesh objects into a single tree mesh, normalized the source's centimetre-like scale, and compressed textures/geometry. | 160.2 MB raw → 8.52 MB runtime | Medium/high-quality background canopy only |
| Ground-cover grass | `decorations/ground-cover-grass-clump-v1.glb` | Reviewed the mixed Plants Asset Set object-by-object, extracted a grass-only strip, centred and scaled it for browser instancing. | 14.5 MB mixed source pack → 733 KB single runtime grass model | Sparse natural ground cover, excluding paths and plant beds |
| Lemongrass (*Cymbopogon citratus*) | [Lemon Grass](https://sketchfab.com/3d-models/lemon-grass-4565bc4142b14e3f8238fbeab8e1e4f3) by charles.cla | CC BY | Downloaded by the user; inspected as a tufted, upright-bladed grass clump. Source has three named LOD meshes and embedded base-colour/normal textures. | 2.94 MB source → 465.66 KB optimized runtime GLB; validator reports no errors, one non-blocking unsupported Meshopt extension warning | Interactive Lemongrass placement |
| Forest trees | [Various Forest Assets Pack](https://sketchfab.com/3d-models/various-forest-assets-pack-cf138b8eb2d340cda643ed59f824989c) by Dari | CC BY | Extracted Apple, Ash, Cherry, Holly, Birch, Maple, and Oak from the already-downloaded source; each is paired with a genus-level educational profile and evidence-linked wildlife, food, or shade benefits. Exact species are not specified by the model pack. | 25.8 MB extracted models → 6.23 MB optimized total; each model validated with no errors and one non-blocking unsupported Meshopt extension warning | Seven interactive garden tree placements with trunk colliders |

### Project-owned Tulsi replacement — 2026-10-25

- Built in Blender from project-owned geometry because the available free download candidates were either sparse or untextured.
- Source: `assets-3d/source/tulsi-custom.blend`; generator: `tools/blender/build_tulsi_custom.py`; preview: `artifacts/qa/tulsi-custom-preview.png`.
- Runtime: `public/models/garden/production/plants/tulsi-custom-v1.glb`.
- The shrub has nine upright shoots, secondary branches, 240 paired leaves, and four flower spikes. It replaces the sparse source in the interactive garden at a normalized scale.
- The model is procedural and stylized rather than photogrammetric; its leaf density and overall scene scale were tuned for the garden.

### Integration safeguards

- Interactive species remain mapped through `garden3dPlacements`; components receive the model reference from this data rather than hardcoding a path.
- The former project-generated Tulsi and low-poly Neem placeholder tree are no longer rendered by the live garden. They remain only as local pipeline history, not as an on-screen fallback.
- Neem is mapped as an interactive placement so its nearby label and click interaction open the real Neem detail page.
- Decorative packs (`Plants Asset Set` and `Various Forest Assets Pack`) are retained as source material. They need per-object review before any part is placed in the scene; no generic pack object will be labelled as a specific medicinal species.
- The current Neem runtime mesh is intentionally gated to medium/high graphics quality. Low mode remains lightweight and uses the existing procedural environment instead.

### Pack inspection result

- `Plants Asset Set` imports as 16 separately positioned unnamed meshes (including large landscape-scale pieces). Its automatic overview render is not a usable garden object, so it requires object-by-object extraction and labelling before use.
- `Various Forest Assets Pack` imports as 57 separately positioned meshes: clearly named material groups include Apple, Ash, Cherry, Plum, Holly, Raspberry, Oak, Maple, Birch, boulders and branch atlases. It is a mixed asset library, not a ready-made garden scene. No entire pack is loaded into the browser.
- This review protects botanical accuracy and prevents the accidental placement of a distant, floating, or incorrectly scaled library object. The source files are preserved for the next curation pass.

## Garden boundary and furniture import — 2026-10-29

The user downloaded these free CC0 assets. Original GLBs are preserved under `assets-3d/source/third-party/garden-atmosphere/`; joined/compressed browser derivatives are under `public/models/garden/production/props/`.

| Role | Asset | Inspected dimensions (width × depth × height) | Source / runtime size | Review |
| --- | --- | --- | --- | --- |
| Fence segment | Picket fence — Original exterior CAD | 2.155 × 0.155 × 1.216 m after a 0.001 scale correction; original exported GLB geometry is in millimetre units | 85.36 KB → 7.85 KB | 26 untextured CAD meshes with flat wood/metal color materials; runtime joins compatible meshes. Apply a restrained wood finish to harmonize with the textured gate during scene review. |
| Entry gate | Garden Picket Gate | 1.302 × 0.113 × 1.287 m | 967.96 KB → 109.99 KB | 19 source mesh objects, textured teak/charcoal PBR materials. |
| Seating | Avenue — Slatted Park Bench | 1.570 × 0.690 × 0.930 m | 1.14 MB → 124.44 KB | 19 source mesh objects, textured PBR teak/metal materials. |
| Night lighting | Post-top Lantern | 0.266 × 0.266 × 1.813 m | 288.62 KB → 69.97 KB | 21 source mesh objects, textured glass/metal/bronze materials; actual light emission will be controlled by the garden's theme-aware lighting. |

All four source GLBs and four optimized derivatives passed the project GLB validator without errors. The source materials pair warm timber with charcoal metal on the fence, gate, and benches; the lantern adds bronze, glass, and an opal diffuser. The fence retains CAD millimetre coordinates, so scene placements use a 0.001 scale. Rendered browser review is scheduled with the expanded-garden QA in Step 17.

The south fence leaves the center segment out and keeps the adjacent panels in place. Their inner edges create an approximately 2.15 m gate opening around the 1.30 m gate, leaving clearance for player movement without the previous over-wide gap.

## Distant mountains and photographic clouds — selected 2026-10-29

| Role | Source | License | Review and runtime treatment |
| --- | --- | --- | --- |
| Distant mountain ring | [Mountainside](https://polyhaven.com/a/mountainside), photography by Dario Barresi and processing by Rico Cilliers | CC0 | Inspected from the user-downloaded 1K glTF. The scan is a rugged, layered cliff face with lichen, not a cone/ridge primitive. Blender inspection measured about 10.2 × 5.2 × 10.5 m. Simplified from 153,472 faces to about 27,600 triangles; 512 px WebP PBR maps and Meshopt produce a 380.78 KB GLB. Twelve shared-mesh placements form a 32 m radius ring beyond the movement boundary. |
| Photo cloud layers | [Realistic transparent clouds](https://olegvegan.itch.io/realistic-transparent-clouds) by OlegVegan | CC0 | Reviewed the supplied transparent PNG pack and selected four distinct photographic layers. Each was exported as a double-sided alpha GLB, padded to power-of-two dimensions, resized to 512 px and converted to WebP/Meshopt; four runtime layers total about 91.6 KB. The same fixed ring of photo cards drifts slowly in both themes and stops under reduced motion; dark-theme tint changes gradually. |

The downloaded mountain ZIP and cloud photo archive are retained under `assets-3d/source/third-party/garden-atmosphere/`. Blender source GLBs are in `assets-3d/derived/atmosphere/`; the runtime models are in `public/models/garden/production/environment/`. The complete garden browser composition review remains in Step 17.
