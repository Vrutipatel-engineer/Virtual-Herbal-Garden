import { Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ComponentRef } from "react";
import { useMemo, useRef } from "react";
import type { Fog, Mesh, Points, ShaderMaterial } from "three";
import { Color, MathUtils, Vector3 } from "three";

const daySkyColor = new Color("#9bb995");
const nightSkyColor = new Color("#08111f");
const nightSunDirection = new Vector3(0.08, -0.16, -1).normalize();
const sunDirection = new Vector3();
const skySunDirection = new Vector3();

function makeStarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const radius = 52;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const elevation = 0.16 + ((index * 37) % 71) / 100;
    const azimuth = index * goldenAngle;
    const horizontalRadius = Math.cos(elevation) * radius;
    positions[index * 3] = Math.cos(azimuth) * horizontalRadius;
    positions[index * 3 + 1] = Math.sin(elevation) * radius;
    positions[index * 3 + 2] = Math.sin(azimuth) * horizontalRadius;
  }

  return positions;
}

/** Theme-linked sky, sun, moon and sparse stars; garden geometry never moves. */
export function GardenAtmosphere({
  isNight,
  reducedMotion,
  quality,
}: {
  isNight: boolean;
  reducedMotion: boolean;
  quality: "low" | "medium" | "high";
}) {
  const backgroundRef = useRef<Color>(null);
  const fogRef = useRef<Fog>(null);
  const skyRef = useRef<ComponentRef<typeof Sky>>(null);
  const sunRef = useRef<Mesh>(null);
  const moonRef = useRef<Mesh>(null);
  const starsRef = useRef<Points>(null);
  const nightBlendRef = useRef(isNight ? 1 : 0);
  const starPositions = useMemo(
    () => makeStarPositions(quality === "low" ? 24 : quality === "medium" ? 36 : 54),
    [quality],
  );

  useFrame(({ clock }, delta) => {
    const blend = MathUtils.damp(nightBlendRef.current, isNight ? 1 : 0, 0.55, delta);
    nightBlendRef.current = blend;

    const phase = reducedMotion ? 0.5 : (clock.elapsedTime / 3600) % 1;
    sunDirection
      .set((phase * 2 - 1) * 0.82, 0.18 + Math.sin(phase * Math.PI) * 0.5, -0.15)
      .normalize();
    skySunDirection.copy(sunDirection).lerp(nightSunDirection, blend).normalize();

    if (backgroundRef.current) {
      backgroundRef.current.copy(daySkyColor).lerp(nightSkyColor, blend);
    }
    if (fogRef.current) {
      fogRef.current.color.copy(daySkyColor).lerp(nightSkyColor, blend);
    }

    const skyMaterial = skyRef.current?.material as ShaderMaterial | undefined;
    if (skyMaterial) {
      const uniforms = skyMaterial.uniforms;
      uniforms.sunPosition.value.copy(skySunDirection);
      uniforms.turbidity.value = MathUtils.lerp(7, 1.4, blend);
      uniforms.rayleigh.value = MathUtils.lerp(1.8, 0.12, blend);
      uniforms.mieCoefficient.value = MathUtils.lerp(0.005, 0.0012, blend);
    }

    if (sunRef.current) {
      sunRef.current.position.copy(sunDirection).multiplyScalar(58);
      (sunRef.current.material as import("three").MeshBasicMaterial).opacity = 1 - blend;
    }
    if (moonRef.current) {
      moonRef.current.position.set(-sunDirection.x * 45, 27, -36);
      (moonRef.current.material as import("three").MeshBasicMaterial).opacity = blend;
    }
    if (starsRef.current) {
      const starMaterial = starsRef.current.material as import("three").PointsMaterial;
      const twinkle = reducedMotion ? 0.86 : 0.83 + Math.sin(clock.elapsedTime * 0.18) * 0.035;
      starMaterial.opacity = blend * twinkle;
      if (!reducedMotion) starsRef.current.rotation.y += delta * 0.00035;
    }
  });

  return (
    <>
      <color ref={backgroundRef} attach="background" args={["#9bb995"]} />
      <fog ref={fogRef} attach="fog" args={["#9bb995", 18, 39]} />
      <Sky
        ref={skyRef}
        distance={450000}
        sunPosition={[0, 1, 0]}
        turbidity={7}
        rayleigh={1.8}
      />
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.62, 24, 16]} />
        <meshBasicMaterial color="#fff2bd" transparent opacity={1} depthWrite={false} toneMapped={false} fog={false} />
      </mesh>
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.58, 24, 16]} />
        <meshBasicMaterial color="#e4e9d8" transparent opacity={0} depthWrite={false} toneMapped={false} fog={false} />
      </mesh>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e5ebff"
          size={1.6}
          sizeAttenuation={false}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </points>
    </>
  );
}
