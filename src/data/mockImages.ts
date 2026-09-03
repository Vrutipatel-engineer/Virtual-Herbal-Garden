import type { PlantImageAsset } from "../types/images";

/**
 * Development-only image metadata.
 *
 * Final image sources are intentionally unresolved. Keeping these records in the
 * data layer lets local assets, remote URLs, or a future CDN replace them without
 * changing any consuming component.
 */
export const createPendingPlantImages = (
  commonName: string,
): { image: PlantImageAsset; images: PlantImageAsset[] } => ({
  image: {
    src: null,
    alt: `${commonName} plant showing its characteristic leaves and natural form`,
    aspectRatio: "4/3",
    focalPoint: { x: 50, y: 45 },
    role: "card",
    status: "placeholder",
  },
  images: [
    {
      src: null,
      alt: `Detailed botanical view of the ${commonName} plant`,
      aspectRatio: "16/10",
      focalPoint: { x: 50, y: 45 },
      role: "hero",
      status: "placeholder",
    },
    {
      src: null,
      alt: `${commonName} growing in a garden setting`,
      aspectRatio: "3/4",
      focalPoint: { x: 50, y: 60 },
      role: "garden",
      status: "placeholder",
    },
  ],
});
