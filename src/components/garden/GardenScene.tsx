import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { DirectionalLight, HemisphereLight, PointLight } from "three";
import { Color, Euler, MathUtils, Quaternion, Ray, Sphere, Vector3 } from "three";
import { garden3dPlacements } from "../../data/garden3d";
import type { GardenLookInput, GardenMovementInput, GardenVector3 } from "../../types/garden";
import { GardenGroundCover } from "./GardenGroundCover";
import { GardenAtmosphere } from "./GardenAtmosphere";
import { GardenClouds } from "./GardenClouds";
import { GardenWorld } from "./GardenWorld";

interface GardenSceneProps {
  active: boolean;
  movementRef: React.RefObject<GardenMovementInput>;
  lookRef: React.RefObject<GardenLookInput>;
  reducedMotion: boolean;
  quality: "low" | "medium" | "high";
  focusedPlantId: string | null;
  onTargetChange: (plantId: string | null) => void;
  onPlayerPositionChange: (position: GardenVector3) => void;
  initialPosition: GardenVector3;
  gateOpen: boolean;
  onGateTargetChange: (focused: boolean) => void;
  entryResetCounter: number;
  night: boolean;
}

const forwardVector = new Vector3();
const rightVector = new Vector3();
const movementVector = new Vector3();
const lookQuaternion = new Quaternion();
const lookEuler = new Euler(0, 0, 0, "YXZ");
const focusVector = new Vector3();
const interactionRay = new Ray();
const interactionSphere = new Sphere();
const dayFill = new Color("#dce9d3");
const nightFill = new Color("#6d7b9b");
const dayGround = new Color("#493d2d");
const nightGround = new Color("#111827");
const daySunlight = new Color("#fff2d0");
const nightMoonlight = new Color("#8fa8d8");

const gardenLampPositions = [
  { position: [-1.45, 2.65, 10.1] as [number, number, number], intensity: 16, distance: 8 },
  { position: [1.45, 2.65, 10.1] as [number, number, number], intensity: 16, distance: 8 },
  { position: [-10.2, 2.65, -5.5] as [number, number, number], intensity: 17, distance: 8 },
  { position: [10.2, 2.65, 5.5] as [number, number, number], intensity: 17, distance: 8 },
  { position: [2.8, 2.65, 7] as [number, number, number], intensity: 18, distance: 8 },
  { position: [-2.8, 2.65, 1.5] as [number, number, number], intensity: 19, distance: 9 },
  { position: [2.8, 2.65, -4] as [number, number, number], intensity: 19, distance: 9 },
  { position: [-2.8, 2.65, -9] as [number, number, number], intensity: 17, distance: 8 },
];

function GardenLighting({ isNight, quality }: {
  isNight: boolean;
  quality: GardenSceneProps["quality"];
}) {
  const hemisphereRef = useRef<HemisphereLight>(null);
  const sunlightRef = useRef<DirectionalLight>(null);
  const lampsRef = useRef<Array<PointLight | null>>([]);
  const nightBlend = useRef(isNight ? 1 : 0);
  const activeLampIndices = quality === "low"
    ? [0, 2, 3, 4, 7]
    : quality === "medium"
      ? [0, 1, 2, 3, 4, 6]
      : gardenLampPositions.map((_, index) => index);

  useFrame((_, delta) => {
    const blend = MathUtils.damp(nightBlend.current, isNight ? 1 : 0, 0.55, delta);
    nightBlend.current = blend;

    const hemisphere = hemisphereRef.current;
    if (hemisphere) {
      hemisphere.intensity = MathUtils.lerp(1.5, 0.48, blend);
      hemisphere.color.copy(dayFill).lerp(nightFill, blend);
      hemisphere.groundColor.copy(dayGround).lerp(nightGround, blend);
    }

    const sunlight = sunlightRef.current;
    if (sunlight) {
      sunlight.intensity = MathUtils.lerp(2.25, 0.22, blend);
      sunlight.color.copy(daySunlight).lerp(nightMoonlight, blend);
    }

    activeLampIndices.forEach((lampIndex) => {
      const light = lampsRef.current[lampIndex];
      if (light) light.intensity = gardenLampPositions[lampIndex].intensity * blend;
    });
  });

  return (
    <>
      <hemisphereLight ref={hemisphereRef} args={[dayFill, dayGround, 1.5]} />
      <directionalLight
        ref={sunlightRef}
        castShadow={quality !== "low"}
        position={[7, 12, 6]}
        intensity={2.25}
        color={daySunlight}
        shadow-mapSize-width={quality === "high" ? 1024 : 512}
        shadow-mapSize-height={quality === "high" ? 1024 : 512}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {gardenLampPositions.map((lamp, index) => (
        activeLampIndices.includes(index) && (
        <pointLight
          key={`garden-lamp-light-${index}`}
          ref={(light) => { lampsRef.current[index] = light; }}
          position={lamp.position}
          color="#ffc77b"
          intensity={0}
          distance={lamp.distance}
          decay={2}
        />
        )
      ))}
    </>
  );
}

function PlayerController({
  active,
  movementRef,
  lookRef,
  onTargetChange,
  onPlayerPositionChange,
  initialPosition,
  onGateTargetChange,
  entryResetCounter,
}: Omit<GardenSceneProps, "reducedMotion" | "quality" | "focusedPlantId" | "gateOpen" | "night">) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const currentTargetRef = useRef<string | null>(null);
  const currentGateTargetRef = useRef(false);
  const lastPositionReportRef = useRef(0);
  const smoothedLookRef = useRef({ yaw: lookRef.current.yaw, pitch: lookRef.current.pitch });
  const { camera } = useThree();
  const placementPoints = useMemo(
    () =>
      garden3dPlacements.map((placement) => ({
        ...placement,
        point: new Vector3(...placement.transform.position).add(
          new Vector3(0, placement.interaction.labelHeight, 0),
        ),
      })),
    [],
  );

  useEffect(() => {
    if (entryResetCounter === 0 || !bodyRef.current) return;
    bodyRef.current.setTranslation({ x: 0, y: 1.1, z: 14.8 }, true);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }, [entryResetCounter]);

  useFrame(({ clock }, delta) => {
    const body = bodyRef.current;
    if (!body) return;

    const targetLook = lookRef.current;
    const look = smoothedLookRef.current;
    look.yaw = MathUtils.damp(look.yaw, targetLook.yaw, 18, delta);
    look.pitch = MathUtils.damp(look.pitch, targetLook.pitch, 18, delta);
    lookEuler.set(look.pitch, look.yaw, 0);
    lookQuaternion.setFromEuler(lookEuler);
    camera.quaternion.copy(lookQuaternion);

    const position = body.translation();
    camera.position.set(position.x, position.y + 0.72, position.z);
    if (clock.elapsedTime - lastPositionReportRef.current > 0.6) {
      lastPositionReportRef.current = clock.elapsedTime;
      onPlayerPositionChange([position.x, position.y, position.z]);
    }

    const input = movementRef.current;
    forwardVector.set(-Math.sin(look.yaw), 0, -Math.cos(look.yaw));
    rightVector.set(Math.cos(look.yaw), 0, -Math.sin(look.yaw));
    movementVector.set(0, 0, 0);

    if (active) {
      if (input.forward) movementVector.add(forwardVector);
      if (input.backward) movementVector.sub(forwardVector);
      if (input.right) movementVector.add(rightVector);
      if (input.left) movementVector.sub(rightVector);
      movementVector.addScaledVector(forwardVector, input.axisZ);
      movementVector.addScaledVector(rightVector, input.axisX);
    }

    const currentVelocity = body.linvel();
    if (movementVector.lengthSq() > 0) movementVector.normalize().multiplyScalar(3.25);
    body.setLinvel(
      { x: movementVector.x, y: currentVelocity.y, z: movementVector.z },
      true,
    );

    camera.getWorldDirection(forwardVector);
    interactionRay.set(camera.position, forwardVector);
    let bestPlantId: string | null = null;
    let bestScore = -Infinity;
    let nearbyPlantId: string | null = null;
    let nearestDistance = 4.5;

    if (active) {
      placementPoints.forEach((placement) => {
        focusVector.copy(placement.point).sub(camera.position);
        const distance = focusVector.length();
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearbyPlantId = placement.plantId;
        }
        if (distance > placement.interaction.radius) return;
        interactionSphere.center.copy(placement.point);
        interactionSphere.radius = 0.52;
        const rayHit = interactionRay.intersectSphere(interactionSphere, focusVector);
        if (!rayHit || rayHit.distanceTo(camera.position) > distance + 0.25) return;
        const score = 2 - distance * 0.035;
        if (score > bestScore) {
          bestScore = score;
          bestPlantId = placement.plantId;
        }
      });
    }

    let gateIsTargeted = false;
    if (active) {
      const gatePoint = new Vector3(0, 0.76, 11.3);
      focusVector.copy(gatePoint).sub(camera.position);
      const gateDistance = focusVector.length();
      if (gateDistance <= 5.5) {
        interactionSphere.center.copy(gatePoint);
        interactionSphere.radius = 0.82;
        const gateHit = interactionRay.intersectSphere(interactionSphere, new Vector3());
        gateIsTargeted = gateHit !== null && gateHit.distanceTo(camera.position) <= gateDistance + 0.2;
      }
    }

    if (gateIsTargeted !== currentGateTargetRef.current) {
      currentGateTargetRef.current = gateIsTargeted;
      onGateTargetChange(gateIsTargeted);
    }

    if (gateIsTargeted) bestPlantId = null;
    else bestPlantId ??= nearbyPlantId;

    if (bestPlantId !== currentTargetRef.current) {
      currentTargetRef.current = bestPlantId;
      onTargetChange(bestPlantId);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={initialPosition}
      colliders={false}
      enabledRotations={[false, false, false]}
      linearDamping={10}
      friction={0}
      canSleep={false}
    >
      <CapsuleCollider args={[0.46, 0.32]} friction={0} />
    </RigidBody>
  );
}

function GardenColliders() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[12.4, 0.2, 12.4]} position={[0, -0.2, 0]} />
      <CuboidCollider args={[42, 0.12, 42]} position={[0, -0.4, 0]} />
      <CuboidCollider args={[0.2, 2, 12.4]} position={[-12.2, 1.8, 0]} />
      <CuboidCollider args={[0.2, 2, 12.4]} position={[12.2, 1.8, 0]} />
      <CuboidCollider args={[12.4, 2, 0.2]} position={[0, 1.8, -12.2]} />
      <CuboidCollider args={[5.66, 2, 0.2]} position={[-6.74, 1.8, 12.2]} />
      <CuboidCollider args={[5.66, 2, 0.2]} position={[6.74, 1.8, 12.2]} />
      <CuboidCollider args={[5.5, 0.2, 3.1]} position={[0, -0.2, 14.8]} />
      <CuboidCollider args={[0.2, 1.5, 3.1]} position={[-5.5, 1.3, 14.8]} />
      <CuboidCollider args={[0.2, 1.5, 3.1]} position={[5.5, 1.3, 14.8]} />
      <CuboidCollider args={[0.2, 2, 42]} position={[-42, 1.8, 0]} />
      <CuboidCollider args={[0.2, 2, 42]} position={[42, 1.8, 0]} />
      <CuboidCollider args={[42, 2, 0.2]} position={[0, 1.8, -42]} />
      <CuboidCollider args={[42, 2, 0.2]} position={[0, 1.8, 42]} />
    </RigidBody>
  );
}

function GardenEntryApron() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 14.8]} receiveShadow>
        <planeGeometry args={[10.8, 6.2]} />
        <meshStandardMaterial color="#8a7b58" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 12.8]} receiveShadow>
        <planeGeometry args={[3.4, 4.2]} />
        <meshStandardMaterial color="#b5a57f" roughness={1} />
      </mesh>
    </>
  );
}

export function GardenScene(props: GardenSceneProps) {
  return (
    <>
      <GardenAtmosphere isNight={props.night} reducedMotion={props.reducedMotion} quality={props.quality} />
      <GardenLighting isNight={props.night} quality={props.quality} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} paused={!props.active}>
          <GardenEntryApron />
          <GardenColliders />
          <GardenWorld
            reducedMotion={props.reducedMotion}
            focusedPlantId={props.focusedPlantId}
            quality={props.quality}
            gateOpen={props.gateOpen}
            isNight={props.night}
          />
          <GardenGroundCover quality={props.quality} reducedMotion={props.reducedMotion} />
          <PlayerController
            active={props.active}
            movementRef={props.movementRef}
            lookRef={props.lookRef}
            onTargetChange={props.onTargetChange}
            onPlayerPositionChange={props.onPlayerPositionChange}
            initialPosition={props.initialPosition}
            onGateTargetChange={props.onGateTargetChange}
            entryResetCounter={props.entryResetCounter}
          />
        </Physics>
        <GardenClouds
          reducedMotion={props.reducedMotion}
          isNight={props.night}
          quality={props.quality}
        />
      </Suspense>
    </>
  );
}
