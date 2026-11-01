export type GardenVector3 = [number, number, number];

export type GardenWindProfile = "tree" | "shrub" | "herb" | "flower";

export type GardenColliderType = "box" | "sphere" | "capsule";

export type GardenQualityLevel = "low" | "medium" | "high";

export interface GardenModelReference {
  /** Provider-independent local, remote, or future CDN model path. */
  src: string;
  /** This plant is drawn from project-owned botanical geometry in React Three Fiber. */
  procedural?: boolean;
  /** Optional node extracted from a shared GLB; its root transform is data-driven below. */
  nodeName?: string;
  /** Lower-to-higher detail candidates reserved for the adaptive quality system. */
  lods?: string[];
  /** Optional replacement model path used if the preferred asset cannot be displayed. */
  fallback?: string;
}

export interface GardenTransform {
  position: GardenVector3;
  rotation: GardenVector3;
  scale: number;
}

export interface GardenInteraction {
  radius: number;
  labelHeight: number;
}

export interface GardenCollider {
  type: GardenColliderType;
  /** Box: half extents. Sphere: radius in x. Capsule: radius in x, half-height in y. */
  size: GardenVector3;
  offset?: GardenVector3;
}

export interface GardenRenderProfile {
  minimumQuality: GardenQualityLevel;
  castShadow: boolean;
  receiveShadow: boolean;
}

export interface GardenWindTarget {
  nodeName: string;
  profile: GardenWindProfile;
  phase: number;
}

export interface GardenSceneAsset {
  id: string;
  role: "terrain" | "pathways" | "environment";
  model: GardenModelReference;
  render: GardenRenderProfile;
  windTargets?: GardenWindTarget[];
}

export interface GardenPlacement {
  kind: "interactive-plant";
  id: string;
  plantId: string;
  model: GardenModelReference;
  transform: GardenTransform;
  interaction: GardenInteraction;
  collider: GardenCollider;
  windProfile: GardenWindProfile;
  render: GardenRenderProfile;
}

export interface GardenDecorationPlacement {
  kind: "decoration";
  id: string;
  model: GardenModelReference;
  transform: GardenTransform;
  /** Optional non-uniform model scale for scenery such as varied mountain ridges. */
  modelScale?: GardenVector3;
  collider?: GardenCollider;
  windProfile?: GardenWindProfile;
  render: GardenRenderProfile;
}

export interface GardenMovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  /** Analog input supplied by the touch joystick, normalized to -1..1. */
  axisX: number;
  axisZ: number;
}

export interface GardenLookInput {
  yaw: number;
  pitch: number;
}
