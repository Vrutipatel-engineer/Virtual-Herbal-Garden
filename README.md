# Verdant — Virtual Herbal Garden

A premium, accessible frontend for discovering medicinal and herbal plants through a structured botanical directory and an interactive digital garden.

## Current milestone

Phase 0 and Phase 1 establish the project foundation:

- React, TypeScript, and Vite application shell
- Responsive global navigation and footer
- Light/dark botanical design tokens with persisted system-aware theme selection
- Approved application routes
- Extensible plant, image, region, resource, and garden-placement models
- A quality starter dataset of 12 plants
- Search, filtering, sorting, statistics, similarity, and image-resolution utilities
- Provider-agnostic image architecture with final sourcing intentionally deferred

See [plan.md](./plan.md) for the complete approved implementation workflow.

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm validate:data
pnpm build
```

## Image architecture

Plant imagery is supplied by data and consumed through reusable components. No production image provider is selected or coupled to the UI at this stage. Pending development image records are isolated in `src/data/mockImages.ts` so local assets, remote URLs, or a future CDN can replace them without component rewrites.

## Content responsibility

Plant information is educational and describes botanical traits or documented traditional context. It is not medical advice and does not make treatment claims.
