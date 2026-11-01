import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, InstancedMesh, Object3D } from "three";
import type { GardenQualityLevel } from "../../types/garden";

type ParticleKind = "leaf" | "petal";

interface FallingLeavesProps {
  enabled: boolean;
  quality: GardenQualityLevel;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  speed: number;
  drift: number;
  phase: number;
  spin: number;
  scale: number;
}

const particleCount = {
  leaf: { low: 12, medium: 22, high: 34 },
  petal: { low: 5, medium: 9, high: 14 },
} as const;

const seededUnit = (index: number, salt: number) => {
  const value = Math.sin(index * 91.31 + salt * 17.17) * 43758.5453;
  return value - Math.floor(value);
};

function DriftingParticles({ kind, quality }: { kind: ParticleKind; quality: GardenQualityLevel }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const particles = useMemo<Particle[]>(() => {
    const count = particleCount[kind][quality];
    const isPetal = kind === "petal";
    return Array.from({ length: count }, (_, index) => ({
      x: (isPetal ? 3.4 : -8.1) + seededUnit(index, 1) * (isPetal ? 2.5 : 3.7),
      y: 0.35 + seededUnit(index, 2) * (isPetal ? 3.3 : 6.8),
      z: (isPetal ? -7.1 : 0.3) + seededUnit(index, 3) * (isPetal ? 2.2 : 3.5),
      speed: (isPetal ? 0.15 : 0.22) + seededUnit(index, 4) * 0.3,
      drift: 0.16 + seededUnit(index, 5) * 0.25,
      phase: seededUnit(index, 6) * Math.PI * 2,
      spin: (seededUnit(index, 7) - 0.5) * 1.4,
      scale: (isPetal ? 0.45 : 0.6) + seededUnit(index, 8) * 0.6,
    }));
  }, [kind, quality]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = clock.elapsedTime;
    particles.forEach((particle, index) => {
      particle.y -= particle.speed * delta;
      if (particle.y < 0.12) particle.y = kind === "petal" ? 3.4 : 6.5 + seededUnit(index, 9) * 1.4;
      dummy.position.set(
        particle.x + Math.sin(time * 0.7 + particle.phase) * particle.drift,
        particle.y,
        particle.z + Math.cos(time * 0.55 + particle.phase) * particle.drift,
      );
      dummy.rotation.set(time * particle.spin, time * particle.spin * 0.7, Math.sin(time + particle.phase));
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]} frustumCulled={false}>
      <circleGeometry args={[kind === "petal" ? 0.07 : 0.09, kind === "petal" ? 6 : 5]} />
      <meshStandardMaterial
        color={kind === "petal" ? "#bd5b66" : "#8d6b32"}
        roughness={0.9}
        side={DoubleSide}
        transparent
        opacity={kind === "petal" ? 0.72 : 0.82}
      />
    </instancedMesh>
  );
}

/** Pooled, instanced falling matter, constrained to the Neem and Hibiscus spawn zones. */
export function FallingLeaves({ enabled, quality }: FallingLeavesProps) {
  if (!enabled) return null;
  return (
    <>
      <DriftingParticles kind="leaf" quality={quality} />
      <DriftingParticles kind="petal" quality={quality} />
    </>
  );
}
