import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import { MathUtils, Quaternion, Vector3 } from "three";
import type {
  GardenCollider,
  GardenDecorationPlacement,
  GardenQualityLevel,
} from "../../types/garden";

interface GardenDecorationProps {
  placement: GardenDecorationPlacement;
  quality: GardenQualityLevel;
  reducedMotion: boolean;
  gateOpen?: boolean;
  isNight: boolean;
}

const qualityRank: Record<GardenQualityLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const windSettings = {
  tree: { speed: 0.42, strength: 0.012 },
  shrub: { speed: 0.68, strength: 0.018 },
  herb: { speed: 0.85, strength: 0.022 },
  flower: { speed: 1.15, strength: 0.028 },
} as const;

function DecorationCollider({ collider }: { collider: GardenCollider }) {
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

/** Renders a data-defined environmental model without making it a plant hotspot. */
export function GardenDecoration({
  placement,
  quality,
  reducedMotion,
  gateOpen = false,
  isNight,
}: GardenDecorationProps) {
  const gltf = useGLTF(placement.model.src);
  const windGroupRef = useRef<Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const gateAngleRef = useRef(0);
  const phase = useMemo(
    () => placement.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) % 23,
    [placement.id],
  );
  const object = useMemo<Object3D>(() => gltf.scene.clone(true), [gltf.scene]);
  const lampMaterials = useMemo(() => {
    if (!placement.id.startsWith("garden-lantern-")) return [];
    const materials: MeshStandardMaterial[] = [];
    object.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const originalMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const clonedMaterials = originalMaterials.map((material) => {
        if (!material.name.toLowerCase().includes("diffuser")) return material;
        const cloned = material.clone() as MeshStandardMaterial;
        cloned.emissiveIntensity = 0;
        materials.push(cloned);
        return cloned;
      });
      mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0];
    });
    return materials;
  }, [object, placement.id]);
  const [baseX, baseY, baseZ] = placement.transform.rotation;
  const isGate = placement.id === "garden-entry-gate";
  const isFence = placement.id.startsWith("fence-");

  useEffect(() => {
    object.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = placement.render.castShadow;
      mesh.receiveShadow = placement.render.receiveShadow;
    });
  }, [object, placement.render.castShadow, placement.render.receiveShadow]);

  useFrame(({ clock }, delta) => {
    const lampEmission = MathUtils.damp(
      lampMaterials[0]?.emissiveIntensity ?? 0,
      isNight ? 2.2 : 0,
      0.7,
      delta,
    );
    lampMaterials.forEach((material) => {
      material.emissiveIntensity = lampEmission;
    });
    if (isGate) {
      const body = rigidBodyRef.current;
      if (body) {
        const targetAngle = gateOpen ? Math.PI * 0.53 : 0;
        gateAngleRef.current += (targetAngle - gateAngleRef.current) * 0.09;
        const rotation = new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          gateAngleRef.current,
        );
        body.setNextKinematicRotation(rotation);
      }
      return;
    }
    const group = windGroupRef.current;
    if (!group || !placement.windProfile) return;
    const { speed, strength } = windSettings[placement.windProfile];
    const amount = reducedMotion ? strength * 0.15 : strength;
    const time = clock.elapsedTime;
    group.rotation.x = baseX + Math.cos(time * speed * 0.71 + phase) * amount * 0.32;
    group.rotation.y = baseY;
    group.rotation.z = baseZ + Math.sin(time * speed + phase) * amount;
  });

  if (qualityRank[quality] < qualityRank[placement.render.minimumQuality]) return null;

  const decoration = (
    <>
      {isGate ? (
        <group position={[0.651, 0, 0]}>
          <primitive object={object} />
        </group>
      ) : (
        <group ref={windGroupRef}>
          <primitive object={object} />
        </group>
      )}
      {isGate && <CuboidCollider args={[0.651, 0.644, 0.07]} position={[0.651, 0.644, 0]} />}
      {!isGate && !isFence && placement.collider && <DecorationCollider collider={placement.collider} />}
    </>
  );

  if (!isGate && (!placement.collider || isFence)) {
    return (
      <group
        position={placement.transform.position}
        rotation={placement.transform.rotation}
        scale={placement.modelScale ?? placement.transform.scale}
      >
        {decoration}
      </group>
    );
  }

  return (
    <RigidBody
      ref={isGate ? rigidBodyRef : undefined}
      type={isGate ? "kinematicPosition" : "fixed"}
      colliders={false}
      position={isGate
        ? [placement.transform.position[0] - 0.651, placement.transform.position[1], placement.transform.position[2]]
        : placement.transform.position}
      rotation={placement.transform.rotation}
      scale={placement.modelScale ?? placement.transform.scale}
    >
      {decoration}
    </RigidBody>
  );
}
