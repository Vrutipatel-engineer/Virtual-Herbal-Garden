import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Material, Mesh, MeshStandardMaterial, Object3D } from "three";
import { Color, DoubleSide } from "three";

const environmentRoot = "/models/garden/production/environment";

const cloudLayers = [
  { id: "cloud-layer-01", position: [0, 21, -35] as [number, number, number], rotation: 0, scale: 6 },
  { id: "cloud-layer-02", position: [-35, 19, 0] as [number, number, number], rotation: Math.PI / 2, scale: 5.5 },
  { id: "cloud-layer-03", position: [0, 22, 35] as [number, number, number], rotation: Math.PI, scale: 6 },
  { id: "cloud-layer-04", position: [35, 18, 0] as [number, number, number], rotation: -Math.PI / 2, scale: 6 },
  { id: "cloud-layer-01", position: [-5, 16, -6] as [number, number, number], rotation: -0.2, scale: 2.8 },
  { id: "cloud-layer-02", position: [6, 18, -2] as [number, number, number], rotation: 0.55, scale: 2.6 },
  { id: "cloud-layer-03", position: [-3, 15, 6] as [number, number, number], rotation: 2.75, scale: 3 },
  { id: "cloud-layer-04", position: [5, 17, 8] as [number, number, number], rotation: -2.2, scale: 2.7 },
] as const;

const lowQualityClouds = [0, 2, 4, 6];

function CloudPhoto({ layer, isNight }: { layer: (typeof cloudLayers)[number]; isNight: boolean }) {
  const gltf = useGLTF(`${environmentRoot}/${layer.id}.glb`);
  const { scene, materials } = useMemo(() => {
    const clonedScene: Object3D = gltf.scene.clone(true);
    const cloudMaterials = new Set<Material>();
    clonedScene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const clonedMaterials = sourceMaterials.map((material) => {
        const cloned = material.clone();
        cloudMaterials.add(cloned);
        return cloned;
      });
      mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0];
    });
    return { scene: clonedScene, materials: [...cloudMaterials] };
  }, [gltf.scene]);
  const targetTint = useMemo(() => new Color(isNight ? "#a5b5d1" : "#ffffff"), [isNight]);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    materials.forEach((material) => {
      material.transparent = true;
      material.depthWrite = false;
      material.side = DoubleSide;
      if ("fog" in material) material.fog = false;
      material.opacity = 0.84;
      material.needsUpdate = true;
    });
  }, [materials, scene]);

  useFrame((_, delta) => {
    materials.forEach((material) => {
      if ("color" in material) {
        (material as MeshStandardMaterial).color.lerp(targetTint, Math.min(delta * 0.7, 1));
      }
    });
  });

  return (
    <group position={layer.position} rotation={[0, layer.rotation, 0]} scale={layer.scale}>
      <primitive object={scene} />
    </group>
  );
}

export function GardenClouds({ reducedMotion, isNight, quality }: {
  reducedMotion: boolean;
  isNight: boolean;
  quality: "low" | "medium" | "high";
}) {
  const cloudRingRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (cloudRingRef.current && !reducedMotion) {
      cloudRingRef.current.rotation.y += delta * 0.0018;
    }
  });

  return (
    <group ref={cloudRingRef}>
      {cloudLayers.map((layer, index) => {
        if (quality === "low" && !lowQualityClouds.includes(index)) return null;
        if (quality === "medium" && index >= 6) return null;
        return <CloudPhoto key={`${layer.id}-${index}`} layer={layer} isNight={isNight} />;
      })}
    </group>
  );
}

cloudLayers.forEach((layer) => useGLTF.preload(`${environmentRoot}/${layer.id}.glb`));
