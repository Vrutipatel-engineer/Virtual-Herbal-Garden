import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import type { Mesh, Object3D } from "three";
import {
  garden3dPlacements,
  gardenDecorations,
  gardenSceneModels,
} from "../../data/garden3d";
import type { GardenQualityLevel, GardenSceneAsset } from "../../types/garden";
import { GardenDecoration } from "./GardenDecoration";
import { GardenPlant } from "./GardenPlant";

interface GardenWorldProps {
  reducedMotion: boolean;
  focusedPlantId: string | null;
  quality: GardenQualityLevel;
  gateOpen: boolean;
  isNight: boolean;
}

interface AnimatedObject {
  object: Object3D;
  baseX: number;
  baseZ: number;
  speed: number;
  strength: number;
  phase: number;
}

const windSettings = {
  tree: { speed: 0.42, strength: 0.018 },
  shrub: { speed: 0.68, strength: 0.023 },
  herb: { speed: 0.85, strength: 0.026 },
  flower: { speed: 1.15, strength: 0.035 },
} as const;

function GardenEnvironmentAsset({
  asset,
  reducedMotion,
  position,
  scale,
}: {
  asset: GardenSceneAsset;
  reducedMotion: boolean;
  position?: [number, number, number];
  scale?: number;
}) {
  const gltf = useGLTF(asset.model.src);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = asset.render.castShadow;
      mesh.receiveShadow = asset.render.receiveShadow;
    });
  }, [asset.render.castShadow, asset.render.receiveShadow, scene]);

  const animatedObjects = useMemo<AnimatedObject[]>(() => {
    return (asset.windTargets ?? []).flatMap(({ nodeName, profile, phase }) => {
      const object = scene.getObjectByName(nodeName);
      if (!object) return [];
      const { speed, strength } = windSettings[profile];
      return [{ object, baseX: object.rotation.x, baseZ: object.rotation.z, speed, strength, phase }];
    });
  }, [asset.windTargets, scene]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    animatedObjects.forEach(({ object, baseX, baseZ, speed, strength, phase }) => {
      const amount = reducedMotion ? strength * 0.15 : strength;
      object.rotation.x = baseX + Math.cos(time * speed * 0.73 + phase) * amount * 0.35;
      object.rotation.z = baseZ + Math.sin(time * speed + phase) * amount;
    });
  });

  return <primitive object={scene} position={position} scale={scale ?? 1} />;
}

export function GardenWorld({ reducedMotion, focusedPlantId, quality, gateOpen, isNight }: GardenWorldProps) {
  const outerTerrainAsset = gardenSceneModels.find((asset) => asset.id === "garden-terrain");
  const fencePlacements = gardenDecorations.filter((placement) => placement.id.startsWith("fence-"));

  return (
    <>
      {gardenSceneModels.map((asset) => (
        <GardenEnvironmentAsset
          key={asset.id}
          asset={asset}
          reducedMotion={reducedMotion}
        />
      ))}
      {outerTerrainAsset && (
        <GardenEnvironmentAsset
          key="garden-outer-terrain"
          asset={outerTerrainAsset}
          reducedMotion={reducedMotion}
          position={[0, -0.28, 0]}
          scale={3.4}
        />
      )}
      {gardenDecorations.map((placement) => (
        <GardenDecoration
          key={placement.id}
          placement={placement}
          quality={quality}
          reducedMotion={reducedMotion}
          gateOpen={placement.id === "garden-entry-gate" ? gateOpen : undefined}
          isNight={isNight}
        />
      ))}
      <RigidBody type="fixed" colliders={false}>
        {fencePlacements.map((placement) => {
          if (placement.collider?.type !== "box") return null;
          const scale = placement.transform.scale;
          const [offsetX, offsetY, offsetZ] = placement.collider.offset ?? [0, 0, 0];
          return (
            <CuboidCollider
              key={`${placement.id}-collision`}
              args={placement.collider.size.map((size) => size * scale) as [number, number, number]}
              position={[
                placement.transform.position[0] + offsetX * scale,
                placement.transform.position[1] + offsetY * scale,
                placement.transform.position[2] + offsetZ * scale,
              ]}
              rotation={placement.transform.rotation}
            />
          );
        })}
      </RigidBody>
      {garden3dPlacements.map((placement) => (
        <GardenPlant
          key={placement.id}
          placement={placement}
          reducedMotion={reducedMotion}
          isFocused={placement.plantId === focusedPlantId}
          quality={quality}
        />
      ))}
    </>
  );
}
