# Virtual Herbal Garden — Final Implementation Plan

## Implementation Progress

- **Phase 0 — Complete:** Repository and tooling audit completed on 3 September 2026.
- **Phase 1 — Complete:** Project foundation, design system, global layout, routing, structured plant data, image architecture, supporting datasets, and utilities implemented and verified.
- **Next approved milestone:** Phase 2 — Landing Page, Plant Directory, Search, Categories, and Plant Cards.

## 1. Plan Status and Scope Guardrails

This document is the approved start-to-finish implementation plan for the Virtual Herbal Garden.

- The previously approved architecture, feature scope, routes, and phase order remain unchanged.
- Visual and image architecture is a first-class, cross-cutting requirement.
- The product hierarchy is: **Plant imagery → Plant discovery → Information → Interaction**.
- No authentication, backend, database, AI plant identification, AR, camera integration, payments, or admin functionality will be added in this version.
- No feature outside the approved scope will be added without discussion and approval.
- The current priority is image architecture and UI readiness, not final image sourcing.
- No external image source, CDN, stock provider, or image API will be selected or integrated at this stage.

---

## 2. Product Goal

Build a modern, premium, responsive, accessible, and interactive frontend that feels like a carefully designed digital botanical garden and plant encyclopedia rather than a generic dashboard, CRUD project, or card-grid template.

The core journey is:

**Discover → Explore → Learn → Save → Interact**

The design should feel natural, calm, modern, educational, editorial, and visually memorable while remaining usable and performant.

---

## 3. Approved Routes

- `/`
- `/plants`
- `/plants/:id`
- `/garden`
- `/my-garden`
- `/regions`
- `/resources`
- Not Found route

---

## 4. Image and Visual Architecture

### 4.1 Architecture Goal

```text
Plant Data
   ↓
image / images field
   ↓
Reusable PlantImage component
   ↓
Plant Card / Detail Page / Virtual Garden
```

The data source must be replaceable later without rewriting consuming UI components:

```text
Local Images
      ↓
Remote Image URLs
      ↓
CDN / Image Service
```

### 4.2 Image Data Model

Images will live in plant/mock data, never inside reusable UI components. The image model will support local assets, remote URLs, and a future CDN or image service.

Suggested extensible shape:

```ts
type PlantImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  focalPoint?: {
    x: number;
    y: number;
  };
  role?: "card" | "hero" | "gallery" | "garden";
  credit?: string;
  sourceId?: string;
};
```

Plants may expose a primary `image` and/or an `images` collection. The final implementation can refine naming without coupling components to a provider.

### 4.3 Component Rules

- `PlantImage`, `PlantCard`, `PlantHero`, `GardenPlant`, and similar components receive image data through props.
- Reusable components must not contain hardcoded plant-image URLs.
- Image rendering behavior will be centralized in `PlantImage` or a small image utility layer.
- Card images will use consistent aspect ratios, controlled cropping, and focal-point-aware object positioning.
- Detail pages will support larger, high-quality images with stable reserved space.
- Meaningful images require specific alt text; decorative visuals will be hidden from assistive technology.
- Lazy loading will be used where appropriate, while important above-the-fold imagery can load eagerly.
- Explicit dimensions or aspect-ratio containers will prevent layout shifts.
- Failed images will show a graceful, botanical-neutral fallback without exposing technical errors.
- Temporary development placeholders, if required, will be isolated in mock/development data and clearly replaceable.

### 4.4 Visual Quality Rules

- Prefer realistic, clean, relevant, and visually consistent botanical imagery.
- Do not reuse one generic image for unrelated plants.
- Avoid low-quality, stretched, unrelated, random, or obvious placeholder-looking production imagery.
- Keep important plant features visible through intentional cropping and object positioning.
- Avoid excessive AI-generated-looking visuals, random illustrations, and decorative clutter when realistic imagery communicates better.
- Image presentation should support discovery and learning rather than overpower content or interaction.

### 4.5 Deferred Image Decisions

The following are deliberately postponed:

- Final image provider selection
- Final plant image sourcing or downloading
- Image-search integration
- Image API integration
- CDN-specific transformations or SDKs
- Production image licensing workflow

These decisions will be handled separately before the production dataset is populated.

---

# Phase 0 — Existing Project Audit

## Step 1: Inspect the current workspace

- Review existing files, folders, framework, build configuration, and dependencies.
- Identify existing user changes and preserve them.
- Check development, lint, type-check, test, and production build commands.
- Record missing dependencies and add only those with a clear purpose.

**Deliverable:** A clear understanding of the existing project without unnecessary rebuilding or destructive changes.

---

# Phase 1 — Project Foundation, Design System, Layout, Routing, and Data

## Step 2: Establish the project structure

Use a logical structure such as:

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── plants/
│   ├── garden/
│   ├── discovery/
│   └── resources/
├── data/
├── hooks/
├── layouts/
├── pages/
├── services/
├── styles/
├── types/
└── utils/
```

Temporary image references, if needed, will be contained in `data` or a clearly named mock-data module rather than UI components.

## Step 3: Build the reusable design-token system

Define:

- Botanical light and dark color palettes
- Typography scale and hierarchy
- Spacing scale
- Border radii
- Borders and dividers
- Shadows
- Container widths
- Responsive breakpoints
- Motion durations and easing
- Focus indicators
- Image aspect ratios and visual treatment tokens

## Step 4: Create the global UI foundation

- CSS reset and base styles
- Responsive content containers
- Semantic page structure
- Display and body typography
- Global focus and accessibility rules
- Reduced-motion support
- Reusable button, link, badge, form-control, and section styles
- Stable image containers that prevent layout shifts

## Step 5: Configure routing

Implement all approved routes with a proper routing solution, including dynamic plant details and a Not Found route.

## Step 6: Build the global layout

- Navbar
- Desktop navigation
- Mobile navigation
- Theme toggle
- Footer
- Page container
- Active navigation states
- Scroll restoration

## Step 7: Define the plant schema

Create an extensible model containing:

```ts
{
  id,
  slug,
  commonName,
  scientificName,
  localNames,
  category,
  plantType,
  family,
  regions,
  habitat,
  climate,
  description,
  traditionalUses,
  characteristics,
  cultivation,
  interestingFacts,
  image,
  images,
  relatedPlantIds,
  featured
}
```

Image fields will use the flexible image model described above.

## Step 8: Prepare a meaningful plant dataset

Create a consistent set of Indian medicinal and herbal plants, prioritizing quality over quantity. Candidate plants include:

- Tulsi
- Neem
- Ashwagandha
- Aloe Vera
- Turmeric
- Brahmi
- Amla
- Lemongrass
- Mint
- Giloy
- Hibiscus
- Moringa

All health-related information will be framed as educational or traditional knowledge and will avoid unsupported medical claims.

Final production images will not be sourced during this step. Any temporary development imagery will remain isolated and replaceable.

## Step 9: Create supporting datasets

- Plant categories
- Plant types
- Indian regions/states
- Habitats
- Climates
- Traditional-use categories
- Educational resources
- Garden scene placement metadata

## Step 10: Create data utilities

- Search plants
- Apply filters
- Sort results
- Calculate statistics
- Group plants by category and region
- Generate similar-plant scores
- Validate plant IDs/slugs
- Resolve primary and role-specific image data without knowing the image provider

**Phase outcome:** A scalable technical, visual, and data foundation ready for every approved feature and future backend/image-source changes.

---

# Phase 2 — Landing Page, Plant Directory, Search, Categories, and Plant Cards

## Step 11: Build common reusable components

- Button
- IconButton
- Badge
- SectionHeading
- SearchBar
- Select/filter controls
- Modal or drawer
- Breadcrumbs
- EmptyState
- ErrorState
- LoadingSkeleton
- `PlantImage` with aspect ratio, alt text, fallback, loading strategy, and focal-point support

## Step 12: Build plant-list components

- PlantCard
- PlantGrid
- FavoriteButton
- CategoryBadge
- ResultCount
- ActiveFilterChips

Plant cards will receive image data through props and use consistent cropping and aspect ratios.

## Step 13: Build the landing-page hero

- “Discover the Healing World of Plants” headline
- Supporting product explanation
- “Explore Plants” primary CTA
- “Enter the Garden” secondary CTA
- Layered botanical visual treatment
- Subtle, professional motion
- Stable image layout across breakpoints

No final external image provider will be selected during this step.

## Step 14: Add Featured Plants

- Render dynamically from the dataset
- Show image, common name, scientific name, category, description, favorite control, and explore action
- Add restrained hover and focus interactions

## Step 15: Add Explore by Category

Create visually distinct botanical category cards for:

- Medicinal
- Aromatic
- Herbal
- Trees
- Shrubs
- Herbs
- Flowers

## Step 16: Add dynamic plant statistics

Calculate from the dataset:

- Total plants
- Categories
- Regions
- Plant families

## Step 17: Add “Why Virtual Herbal Garden?”

Explain:

- Discovering plants
- Learning traditional knowledge
- Exploring botanical information
- Understanding plant diversity

## Step 18: Add the Educational Resources preview

Render selected resources and link to the full Resources page.

## Step 19: Add the final landing CTA

Create the botanical-themed “Start Exploring the Garden” section.

## Step 20: Build the Plant Directory header and search

- Prominent search field
- Page introduction
- Live result count
- Search common names, scientific names, and local names
- Normalize casing, whitespace, and partial matching

## Step 21: Build filtering and sorting

Filters:

- Category
- Plant type
- Region
- Habitat
- Climate

Sorting:

- Name A–Z
- Name Z–A
- Featured first

## Step 22: Build the responsive results experience

- Responsive plant grid
- Desktop filter panel
- Mobile filter drawer
- Active filter chips
- Clear-all action
- Smooth result transitions
- Loading skeletons
- “No plants found” empty state
- Friendly error state

**Phase outcome:** A visually strong landing page and an intuitive, responsive, image-ready plant directory.

---

# Phase 3 — Plant Detail, Plant Story, Similar Plants, Smart Discovery, and Regions

## Step 23: Build the Plant Detail header

- Large, high-quality image area
- Common name
- Scientific name
- Category
- Favorite action
- Breadcrumbs
- Stable responsive image space with focal-point-aware cropping

## Step 24: Build Quick Facts

- Scientific name
- Family
- Plant type
- Native regions
- Habitat
- Climate

## Step 25: Build rich information sections

- Overview
- Traditional Uses
- Properties / Characteristics
- Habitat
- Cultivation: soil, water, sunlight, climate, and propagation
- Interesting Facts

Include responsible educational framing and avoid unsupported medical claims.

## Step 26: Build Plant Story

Use an editorial or timeline-style presentation:

```text
Origin
  ↓
Appearance
  ↓
Traditional Uses
  ↓
Habitat
  ↓
Cultivation
  ↓
Interesting Facts
```

Desktop can use a richer timeline/editorial layout; mobile will use a readable stacked flow.

## Step 27: Build Similar Plants

Generate “You May Also Like” results using weighted attributes:

- Explicit related plant IDs
- Category
- Plant type
- Region overlap
- Habitat
- Related characteristics

Recommendations will not be random.

## Step 28: Handle invalid plant routes

Show a friendly “Plant not found” state with a route back to discovery.

## Step 29: Build Smart Plant Discovery

Support rule-based intents such as:

- Show aromatic plants
- Explore a selected region
- Find tropical-climate plants
- Browse herbs, shrubs, or trees
- Browse by habitat
- Browse by traditional-use category

Display applied criteria, match count, recommended plants, reset action, and a no-match state.

## Step 30: Build Explore by Region

- Region cards
- Dataset-derived plant counts
- Short regional context
- Featured plants
- Region filtering
- Region-specific plant collections
- Links into the Plant Directory and Plant Detail pages

The data shape will remain ready for a future interactive India map without adding unnecessary map complexity now.

**Phase outcome:** A premium encyclopedia experience with meaningful discovery, storytelling, recommendations, and regional exploration.

---

# Phase 4 — Interactive Virtual Garden and My Garden / Favorites

## Step 31: Design the Virtual Garden scene

The Virtual Garden must be a real scene, not another grid of cards. It will include:

- Layered ground or grass
- Organic paths
- Natural plant zones
- Different plant sizes
- Trees, shrubs, herbs, and flowers
- Foreground, middle-ground, and background depth
- Plant hotspots and labels
- Restrained environmental details

Scene composition will prioritize plant recognition and interaction over decorative clutter.

## Step 32: Create garden placement data

Keep garden layout information separate from components. Suggested metadata can include:

```ts
{
  plantId,
  x,
  y,
  scale,
  depth,
  layer,
  labelPosition,
  imageRole
}
```

This keeps natural positioning data-driven and makes plants/images replaceable.

## Step 33: Build GardenScene and GardenPlant

- Render plants from garden placement data
- Resolve garden-specific image data through props
- Support different sizes and depth layers
- Maintain stable layout and appropriate cropping
- Keep decorative scene layers separate from meaningful plant images

## Step 34: Add garden interactions

Desktop:

- Hover to preview
- Click to select
- Explore action to open full details

Mobile:

- Tap to select
- Compact preview or bottom sheet
- Touch-friendly controls
- Adapted positioning and/or accessible scene navigation

## Step 35: Add subtle garden atmosphere

- Gentle leaf/plant movement
- Restrained depth or parallax where useful
- Clear hover, focus, and selected states
- Performance-safe transform/opacity animation
- Reduced-motion alternative

## Step 36: Add accessible and resilient garden states

- Keyboard-accessible hotspots
- Screen-reader-friendly plant names and actions
- Accessible list alternative where needed
- Garden loading state
- Graceful image failure fallback
- Friendly scene error state

## Step 37: Build the favorites system

- Reusable favorites state/hook/context
- Browser-storage persistence
- Synchronized favorite state across cards, detail pages, similar plants, and garden previews
- Accessible saved/removed feedback

## Step 38: Build My Garden

- Saved plant collection
- Saved count
- Remove favorite action
- Open plant details action
- Responsive personalized layout

## Step 39: Build the empty My Garden state

Message:

> Your garden is waiting to grow.

Action:

> Explore Plants

**Phase outcome:** A memorable, performant virtual garden and a persistent personalized plant collection.

---

# Phase 5 — Themes, Motion, States, Accessibility, and Responsive Polish

## Step 40: Complete the light theme

- Warm botanical background
- Natural greens
- Earthy neutrals
- Soft borders
- Restrained shadows
- Image treatments that feel natural and editorial

## Step 41: Complete the dark theme

- Deep botanical surfaces
- Muted natural accents
- High text readability
- Separately tuned borders and shadows
- Image presentation that remains balanced without simple color inversion

## Step 42: Implement theme behavior

- Respect system preference on first load
- Manual theme toggle
- Persist choice in browser storage
- Avoid incorrect-theme flash where practical
- Use restrained theme transitions

## Step 43: Add purposeful micro-interactions

- Card hover/focus
- Controlled image zoom
- Favorite animation
- Button feedback
- Navigation state changes
- Filter transitions
- Garden hover/tap feedback
- Section reveals
- Theme transitions

## Step 44: Respect reduced-motion preferences

Reduce or disable nonessential transitions, parallax, reveals, and garden movement when requested by the user’s system.

## Step 45: Complete loading states

- Plant-card skeletons with reserved image space
- Plant-detail skeleton
- Filtered-results feedback
- Garden loading state
- Avoid blank screens and layout shifts

## Step 46: Complete empty states

- No search results
- No filtered results
- Empty My Garden
- Empty resource category
- Clear next actions

## Step 47: Complete friendly error states

- Missing plant
- Failed image
- Invalid route
- Simulated data-loading failure
- Retry or navigation actions
- Never show raw technical errors to users

## Step 48: Complete accessibility

- Semantic landmarks and HTML
- Correct heading hierarchy
- Full keyboard navigation
- Visible focus states
- Accessible buttons and form controls
- Meaningful image alt text
- Decorative-image handling
- Favorite-state announcements
- Search-result announcements where appropriate
- Sufficient contrast
- Touch-friendly targets
- No information communicated through color alone

## Step 49: Complete responsive behavior

Desktop/laptop:

- Balanced content widths
- Generous controlled whitespace
- Multi-column editorial layouts
- Full garden presentation

Tablet:

- Adapted grids
- Compact navigation
- Reorganized detail sections
- Responsive garden composition

Mobile:

- Purpose-built mobile navigation
- Appropriate card columns
- Filter drawer
- Readable Plant Story flow
- Tap-based garden interaction
- Comfortable controls
- No horizontal overflow

**Phase outcome:** A cohesive, accessible, resilient experience across themes, input methods, motion preferences, and screen sizes.

---

# Phase 6 — Educational Resources, Statistics, Final QA, and Delivery

## Step 50: Build the Educational Resources directory

Topics include:

- Introduction to medicinal plants
- Botanical terminology
- Plant identification basics
- Cultivation basics
- Understanding plant families
- Responsible herbal knowledge

Each resource card will include a title, short description, category, and read/explore action.

## Step 51: Add resource browsing states

- Category filters
- Result counts where useful
- Empty category state
- Friendly error state
- Responsive card presentation

## Step 52: Verify dynamic statistics

Confirm all counts are calculated from the dataset and update automatically when plant data changes.

## Step 53: Review code quality

- Remove duplication
- Simplify components
- Verify naming consistency
- Validate types/interfaces
- Remove unused code and dependencies
- Resolve console warnings
- Confirm no UI component is coupled to an image provider
- Confirm no external production image URLs are hardcoded in reusable components

## Step 54: Run functional verification

Test:

- All routes and navigation
- Search
- Filters
- Sorting
- Favorites persistence
- Theme persistence
- Similar-plant logic
- Smart discovery
- Region exploration
- Garden interactions
- Image loading, fallback, alt text, cropping, and layout stability

## Step 55: Run technical verification

- Lint
- Type checking
- Automated tests where present
- Production build
- Broken imports
- Runtime errors
- Dynamic-route refresh behavior
- Performance-sensitive image and garden behavior

## Step 56: Perform page-by-page visual QA

Review:

- Landing page
- Plant Directory
- Plant Detail
- Virtual Garden
- My Garden
- Regions
- Resources
- Empty states
- Error states
- Not Found page

Check light and dark modes at desktop, laptop, tablet, and multiple mobile widths.

## Step 57: Perform final visual refinements

- Typography hierarchy
- Spacing rhythm
- Image aspect-ratio consistency
- Image crops and focal points
- Card consistency
- Color contrast
- Hover and focus behavior
- Content overflow
- Dark-theme balance
- Garden depth, labels, and interaction clarity
- Decorative restraint

## Step 58: Final scope and delivery audit

Confirm:

- Only approved features are present.
- There is no fake functionality.
- Medicinal content is responsibly framed.
- Statistics are dataset-driven.
- All CTAs work.
- Final image sourcing remains uncommitted and replaceable.
- The interface is portfolio-ready and visually cohesive.

**Phase outcome:** A verified, production-build-ready frontend that can confidently be presented in a Frontend/UI Developer portfolio.

---

# 5. Definition of Done

The project is complete when all of the following are true:

- Every approved route and feature is functional.
- Plant data is structured, consistent, and separate from UI components.
- Image data is passed from data to reusable components through props.
- Replacing local images with remote URLs or a future CDN requires minimal or no component changes.
- No reusable UI component contains hardcoded plant-image URLs or provider-specific logic.
- Plant cards use consistent aspect ratios and intentional crops.
- Plant Detail pages support larger, stable, high-quality image presentation.
- Meaningful plant images have appropriate alt text.
- Lazy loading, graceful fallbacks, and layout-shift prevention are implemented where appropriate.
- Search, filters, sorting, and smart discovery work correctly.
- Similar plants are attribute-based rather than random.
- Favorites remain saved after refresh.
- The Virtual Garden is an interactive layered scene, not a normal card grid.
- Garden interactions are performant, responsive, keyboard-accessible, and reduced-motion aware.
- Light and dark themes are separately polished.
- Loading, empty, error, and Not Found states are present.
- Mobile layouts are thoughtfully adapted rather than merely shrunk.
- Accessibility requirements are satisfied.
- Lint, type-check, tests where present, and production build pass.
- No authentication, backend, database, AI, AR, camera, payment, or admin feature has been introduced.
- The final UI feels like a deliberate premium botanical product, not a generic template.

---

# 6. Image Source Decision Gate

Before final production plant images are populated, pause for a separate approved decision covering:

- Image source/provider
- Licensing and attribution requirements
- Required resolutions and aspect ratios
- Local versus remote hosting
- CDN/transformation strategy, if any
- Replacement of development placeholders
- Final consistency and botanical-accuracy review

Until that decision is made, implementation will focus on flexible data fields, reusable components, resilient image behavior, and layout readiness only.
