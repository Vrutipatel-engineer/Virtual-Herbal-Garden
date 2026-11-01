# Verdant — Virtual Herbal Garden

Verdant is a bilingual botanical learning website that helps people explore India's medicinal and herbal plants through an accessible plant library, regional discovery, and an interactive 3D garden.

## Explore Verdant

- Browse 19 plant profiles with search, filters, sorting, local names, habitats, and cultivation guidance.
- Explore plants through 7 regions, 6 guided Smart Discovery paths, and related-plant suggestions.
- Switch between English and Hindi across the browsing experience and plant content.
- Save plants to My Garden; favorites persist in the browser.
- Enter a first-person 3D garden with keyboard controls on desktop and touch controls on mobile. Inspect plant hotspots and open their educational profiles.
- Use light or dark themes, reduced-motion settings, and accessible directory alternatives to the 3D scene.
- Read educational resources about plants and botanical topics.

The virtual garden contains 12 interactive plant and tree placements. Plant information is for education and botanical discovery; it is not medical advice.

## Technology

- React, TypeScript, and Vite
- React Router
- Three.js, React Three Fiber, Drei, and Rapier
- Responsive CSS

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Vite prints the local development address in the terminal.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm validate:data
pnpm validate:models
pnpm build
```

## 3D assets

Optimized runtime models are served from `public/models`. Source assets, processing scripts, and the Blender workflow are maintained separately. Third-party asset authors and license terms are recorded in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). The 3D runtime and asset workflow are described in [docs/3d-foundation.md](./docs/3d-foundation.md).
