export type ImageRole = "card" | "hero" | "gallery" | "garden";

export type ImageStatus = "placeholder" | "ready";

export interface ImageFocalPoint {
  x: number;
  y: number;
}

export interface PlantImageAsset {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: `${number}/${number}`;
  focalPoint?: ImageFocalPoint;
  role?: ImageRole;
  credit?: string;
  sourceId?: string;
  status: ImageStatus;
}
