import { useMemo } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";
import { garden3dPlacements } from "../../data/garden3d";
import type { GardenQualityLevel } from "../../types/garden";

interface GardenGroundCoverProps {
  quality: GardenQualityLevel;
  reducedMotion: boolean;
}

const clumpCountByQuality = { low: 36, medium: 80, high: 150 } as const;
const bladesPerClump = { low: 12, medium: 18, high: 24 } as const;

const grassColors = [
  [0.22, 0.31, 0.12],
  [0.31, 0.4, 0.16],
  [0.39, 0.43, 0.2],
  [0.48, 0.48, 0.25],
  [0.25, 0.36, 0.14],
] as const;

const seededUnit = (index: number, salt: number) => {
  const value = Math.sin(index * 79.17 + salt * 11.29) * 43758.5453;
  return value - Math.floor(value);
};

interface GroundPoint { x: number; z: number; }

const pathSegments: Array<[GroundPoint, GroundPoint, number]> = [
  [{ x: 0, z: -12.2 }, { x: 0, z: -4.05 }, 1.95],
  [{ x: 0, z: -4.05 }, { x: -0.55, z: 2.35 }, 1.95],
  [{ x: -0.55, z: 2.35 }, { x: 0.45, z: 9.4 }, 1.95],
];

function distanceToSegment(point: GroundPoint, start: GroundPoint, end: GroundPoint) {
  const deltaX = end.x - start.x;
  const deltaZ = end.z - start.z;
  const lengthSquared = deltaX * deltaX + deltaZ * deltaZ;
  const progress = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((point.x - start.x) * deltaX + (point.z - start.z) * deltaZ) / lengthSquared,
  ));
  return Math.hypot(point.x - (start.x + deltaX * progress), point.z - (start.z + deltaZ * progress));
}

function isClearGround(point: GroundPoint) {
  if (pathSegments.some(([start, end, clearance]) => distanceToSegment(point, start, end) < clearance)) {
    return false;
  }
  return !garden3dPlacements.some((placement) => {
    const [plantX, , plantZ] = placement.transform.position;
    const clearance = placement.windProfile === "tree" ? 0.88 : 0.48;
    return Math.hypot(point.x - plantX, point.z - plantZ) < clearance;
  });
}

function createUprightGrass(quality: GardenQualityLevel) {
  const clumpCount = clumpCountByQuality[quality];
  const bladeCount = bladesPerClump[quality];
  const candidates = Array.from({ length: clumpCount * 10 }, (_, index) => ({
    x: -10.7 + seededUnit(index, 1) * 21.4,
    z: -10.7 + seededUnit(index, 2) * 21.4,
  })).filter(isClearGround).slice(0, clumpCount);

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  let vertexOffset = 0;

  candidates.forEach((clump, clumpIndex) => {
    const clumpRadius = 0.16 + seededUnit(clumpIndex, 5) * 0.2;
    const clumpRotation = seededUnit(clumpIndex, 6) * Math.PI * 2;

    for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex += 1) {
      const seed = clumpIndex * bladeCount + bladeIndex;
      const angle = seededUnit(seed, 7) * Math.PI * 2 + clumpRotation;
      const radialDistance = Math.sqrt(seededUnit(seed, 8)) * clumpRadius;
      const baseX = clump.x + Math.cos(angle) * radialDistance;
      const baseZ = clump.z + Math.sin(angle) * radialDistance;
      const heightRoll = seededUnit(seed, 9);
      const height = heightRoll < 0.62
        ? 0.24 + seededUnit(seed, 14) * 0.18
        : heightRoll < 0.86
          ? 0.42 + seededUnit(seed, 14) * 0.2
          : 0.66 + seededUnit(seed, 14) * 0.28;
      const bladeWidth = 0.014 + seededUnit(seed, 10) * 0.012;
      const lean = 0.025 + seededUnit(seed, 11) * 0.105;
      const leanAngle = angle + (seededUnit(seed, 12) - 0.5) * 0.9;
      const leanX = Math.cos(leanAngle) * lean;
      const leanZ = Math.sin(leanAngle) * lean;
      const sideX = -Math.sin(angle) * bladeWidth * 0.5;
      const sideZ = Math.cos(angle) * bladeWidth * 0.5;
      const color = grassColors[Math.floor(seededUnit(seed, 13) * grassColors.length)];

      // Each blade is a narrow, tapered ribbon that grows upward from the soil.
      positions.push(
        baseX - sideX, 0.012, baseZ - sideZ,
        baseX + sideX, 0.012, baseZ + sideZ,
        baseX + leanX * 0.3 - sideX * 0.62, height * 0.56, baseZ + leanZ * 0.3 - sideZ * 0.62,
        baseX + leanX * 0.3 + sideX * 0.62, height * 0.56, baseZ + leanZ * 0.3 + sideZ * 0.62,
        baseX + leanX, height, baseZ + leanZ,
      );

      for (let vertex = 0; vertex < 5; vertex += 1) {
        const shade = vertex === 4 ? 1.15 : vertex > 1 ? 1.05 : 0.82;
        colors.push(color[0] * shade, color[1] * shade, color[2] * shade);
      }

      indices.push(
        vertexOffset, vertexOffset + 1, vertexOffset + 2,
        vertexOffset + 1, vertexOffset + 3, vertexOffset + 2,
        vertexOffset + 2, vertexOffset + 3, vertexOffset + 4,
      );
      vertexOffset += 5;
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Procedural narrow blades keep the ground cover upright instead of reusing a low, bushy asset. */
export function GardenGroundCover({ quality }: GardenGroundCoverProps) {
  const grassGeometry = useMemo(() => createUprightGrass(quality), [quality]);

  return (
    <group aria-label="Upright grass ground cover">
      <mesh geometry={grassGeometry} castShadow={false} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}
