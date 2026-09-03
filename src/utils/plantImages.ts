import type { ImageRole, PlantImageAsset } from "../types/images";
import type { Plant } from "../types/plant";

export const getPlantImage = (
  plant: Plant,
  role: ImageRole = "card",
): PlantImageAsset => {
  if (role === "card" && plant.image) {
    return plant.image;
  }

  return (
    plant.images.find((image) => image.role === role) ??
    plant.image ??
    plant.images[0]
  );
};

export const getObjectPosition = (image: PlantImageAsset) => {
  const focalPoint = image.focalPoint ?? { x: 50, y: 50 };
  return `${focalPoint.x}% ${focalPoint.y}%`;
};

export const isImageReady = (
  image: PlantImageAsset,
): image is PlantImageAsset & { src: string } =>
  image.status === "ready" && Boolean(image.src);
