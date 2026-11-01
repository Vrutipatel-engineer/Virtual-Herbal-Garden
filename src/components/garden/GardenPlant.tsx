import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, Object3D } from "three";
import type { GardenCollider, GardenPlacement, GardenQualityLevel } from "../../types/garden";

interface GardenPlantProps {
  placement: GardenPlacement;
  reducedMotion: boolean;
  isFocused: boolean;
  quality: GardenQualityLevel;
}

const windSettings = {
  tree: { speed: 0.42, strength: 0.018 },
  shrub: { speed: 0.68, strength: 0.023 },
  herb: { speed: 0.85, strength: 0.026 },
  flower: { speed: 1.15, strength: 0.035 },
} as const;

function PlacementCollider({ collider }: { collider: GardenCollider }) {
  const position = collider.offset ?? [0, 0, 0];

  switch (collider.type) {
    case "sphere":
      return <BallCollider args={[collider.size[0]]} position={position} />;
    case "capsule":
      return (
        <CapsuleCollider
          args={[collider.size[1], collider.size[0]]}
          position={position}
        />
      );
    case "box":
      return <CuboidCollider args={collider.size} position={position} />;
  }
}

function GardenPlantFallback({ profile }: { profile: GardenPlacement["windProfile"] }) {
  const color = profile === "flower" ? "#a84446" : "#3f6f3e";

  return (
    <group aria-hidden="true">
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 0.9, 7]} />
        <meshStandardMaterial color="#51643a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
    </group>
  );
}

function GardenModelPlant({ placement, reducedMotion, isFocused, quality }: GardenPlantProps) {
  const modelSource = quality === "low" ? placement.model.lods?.[0] ?? placement.model.src : placement.model.src;
  // The rigid body scale also scales child meshes. Counteract that scale so
  // the focus ring stays near the plant instead of growing with large models.
  const focusRingScale = 1 / placement.transform.scale;
  const gltf = useGLTF(modelSource);
  const windGroupRef = useRef<Group>(null);
  const phase = useMemo(
    () =>
      placement.id.split("").reduce((total, character) => total + character.charCodeAt(0), 0) %
      17,
    [placement.id],
  );
  const plantObject = useMemo<Object3D | null>(() => {
    const source = placement.model.nodeName
      ? gltf.scene.getObjectByName(placement.model.nodeName)
      : gltf.scene;

    if (!source) return null;

    const clone = source.clone(true);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    return clone;
  }, [gltf.scene, placement.model.nodeName]);

  useEffect(() => {
    plantObject?.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = placement.render.castShadow;
      mesh.receiveShadow = placement.render.receiveShadow;
    });
  }, [placement.render.castShadow, placement.render.receiveShadow, plantObject]);

  useFrame(({ clock }) => {
    const group = windGroupRef.current;
    if (!group) return;
    const { speed, strength } = windSettings[placement.windProfile];
    const amount = reducedMotion ? strength * 0.15 : strength;
    const time = clock.elapsedTime;
    group.rotation.x = Math.cos(time * speed * 0.73 + phase) * amount * 0.35;
    group.rotation.z = Math.sin(time * speed + phase) * amount;
  });

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={placement.transform.position}
      rotation={placement.transform.rotation}
      scale={placement.transform.scale}
    >
      <group ref={windGroupRef}>
        {plantObject ? (
          <primitive object={plantObject} />
        ) : (
          <GardenPlantFallback profile={placement.windProfile} />
        )}
      </group>
      {isFocused && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.035 * focusRingScale, 0]}
          aria-hidden="true"
        >
          <ringGeometry args={[0.54 * focusRingScale, 0.68 * focusRingScale, 32]} />
          <meshBasicMaterial color="#f1d999" transparent opacity={0.88} side={2} />
        </mesh>
      )}
      <PlacementCollider collider={placement.collider} />
    </RigidBody>
  );
}

export function GardenPlant(props: GardenPlantProps) {
  return <GardenModelPlant {...props} />;
}
