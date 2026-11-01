# Category and plant coverage audit

Audit date: 2026-11-01

This is the starting inventory for the user's content update. Category count follows the website's current category cards; every displayed card is in scope, regardless of the total count.

## Existing category cards

| Category card | Current filter | Plants in Explore | In the 3D Garden | Finding |
|---|---|---:|---:|---|
| Ecological | Category = Ecological | 7 | 7 | Meets the two-item minimum. |
| Medicinal | Category = Medicinal | 6 | 3 | Meets minimum in both. |
| Aromatic | Category = Aromatic | 3 | 2 | Meets minimum in both. |
| Herbal | Curated home-use group | 6 | 4 | Now distinct from the Herbs card. |
| Trees | Plant type = Tree | 10 | 8 | Meets minimum in both. |
| Shrubs | Plant type = Shrub | 2 | 2 | Meets the minimum after adding an authored Ashwagandha shrub to the Garden. |
| Herbs | Plant type = Herb | 6 | 3 | Botanical growth-form filter; distinct from the curated Indian home-use Herbal group. |
| Flowers | Curated flowering group | 2 | 2 | Directory and Garden minimums met with flowering Hibiscus and Tulsi. |

## Existing Garden roster

Tulsi, Aloe vera, Hibiscus, Neem, Ashwagandha, Lemongrass, Apple tree, Ash tree, Cherry tree, Holly, Birch tree, Maple tree, and Oak tree. All 13 have corresponding entries in the Explore Plants data.

## Data and image status

- Explore Plants currently has 19 entries (12 Indian plant records plus 7 forest-tree profiles).
- All 19 plant records now point to species-specific, credited image sources. Six image files are local; the rest use Wikimedia Commons' 1200 px file rendition.
- The Garden's interactive plant placements refer to plant IDs from the same plant dataset, so the directory can remain the single source of truth.
- The current category UI has eight cards. Herbal is a curated Indian home-use group; Herbs remains a botanical plant-type filter.

## “Why Verdant?” claim review

| Claim | Current support | Decision |
| --- | --- | --- |
| Discover with purpose | Profiles connect names to place, form, habitat, and cultural context; directory filters support those paths. | Keep. |
| Learn in context | Educational resources and plant pages distinguish traditional practice from medical evidence and include a safety note. | Keep, while maintaining those boundaries. |
| Understand diversity | The dataset shows plant families, climates, types, habitats, and regions, with related-plant links. | Keep. |
| Preserve knowledge | The site documents knowledge but does not yet offer community archiving or preservation tools. | Reworded to “Respect cultural context” so the claim matches what the site does. |

## Work sequence derived from this audit

1. Give every existing category card at least two relevant plant/tree results in both Explore Plants and the 3D Garden. Directory and Garden coverage are in place, including a procedurally authored Ashwagandha shrub.
2. Source a specific, appropriately licensed image for each profile, connect credits, and keep attributions visible. All 19 records now have a source; 6 are local and 13 use Commons' 1200 px rendition at runtime.
3. Add a persistent English/Hindi language switch and Hindi content for all user-facing interface, plant, and learning text. Hindi coverage includes interface labels, all 19 plant profiles, and all six learning guides. Scientific names stay in Latin.
4. Verify “Why Verdant?” against implemented features. Three claims remain supported; “Preserve knowledge” was revised to “Respect cultural context” and the audit is documented above.
5. Review category results, Garden interactions, image sources/fallbacks, and keyboard access. Static checks pass; interactive browser review remains pending.
6. Review the full site on desktop and mobile in English and Hindi. TypeScript and ESLint pass. Browser review is pending because local browser access is disabled in the current work settings.
