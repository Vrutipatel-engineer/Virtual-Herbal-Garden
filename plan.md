# Verdant — Product Brief

## Product purpose

Verdant is a bilingual digital garden for learning about India's medicinal and herbal plants. It brings plant discovery, regional context, cultivation information, and an interactive garden together in one responsive website.

## Audience

The experience is designed for curious learners, home gardeners, and anyone who wants an approachable introduction to India's plant diversity. The content supports exploration and education; it does not provide diagnosis or medical treatment advice.

## Core experience

### Discover plants

Visitors can browse a searchable plant directory, narrow results with filters, sort the collection, explore botanical categories and regions, and follow guided Smart Discovery paths. Related-plant suggestions help connect species by shared traits and context.

### Learn about each plant

Plant profiles bring together common, scientific, and local names; habitat and regional context; botanical characteristics; cultivation guidance; and carefully framed educational information about documented traditional uses.

### Explore the virtual garden

The first-person 3D garden offers desktop keyboard and mobile touch controls. Visitors can move through a planted landscape, inspect interactive plant and tree placements, and open the related plant profiles. Accessible directory and preview controls provide an alternative to navigating the 3D scene.

### Save and revisit

Visitors can save favorites to My Garden. Their selection is kept in browser storage so it remains available when they return on the same browser.

### Browse in English or Hindi

The interface and plant content support English and Hindi. Light and dark themes, reduced-motion preferences, and responsive layouts support different viewing conditions and devices.

## Content scope

The collection contains 19 plant profiles, 7 regional guides, 6 guided discovery paths, educational resources, and 12 interactive plant and tree placements in the virtual garden.

## Product principles

- **Botanical clarity:** use common, scientific, and Indian local names where available.
- **Responsible context:** distinguish botanical facts from traditional knowledge and avoid unsupported health claims.
- **Inclusive access:** support keyboard, touch, reduced motion, clear focus, and non-3D alternatives.
- **Responsive performance:** adapt the visual workload to the device while preserving a usable garden experience.
- **Traceable assets:** record third-party sources, creator credits, and license terms for garden models and imagery.
- **Maintainable content:** keep plant facts and garden placement data separate from presentation components.

## Technical foundation

The website uses React, TypeScript, Vite, and React Router. The garden uses Three.js, React Three Fiber, Drei, and Rapier. Plant, region, and resource content is stored as structured data; optimized GLB files are served from the public asset directory.

## Quality expectations

The website should present a consistent English and Hindi experience, adapt to desktop and mobile screens, keep navigation and discovery controls understandable, and show useful feedback while content loads or when a route has no result. The production build and data and asset validation commands provide repeatable checks during development.
