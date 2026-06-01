"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/** Generate `count` points uniformly distributed inside a sphere of `radius`. */
function pointsInSphere(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Rejection sampling for an even volume distribution.
    let x = 0,
      y = 0,
      z = 0,
      d = 2;
    while (d > 1 || d === 0) {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      d = x * x + y * y + z * z;
    }
    arr[i * 3] = x * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = z * radius;
  }
  return arr;
}

/** A drifting starfield of brand-colored particles that reacts to the pointer. */
function Stars() {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => pointsInSphere(3500, 1.5), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Slow ambient drift — fully independent of the pointer / cursor.
    ref.current.rotation.x -= delta / 18;
    ref.current.rotation.y -= delta / 24;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#67e8f9"
          size={0.0045}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

interface ParticleFieldProps {
  className?: string;
  /** Opacity of the whole canvas — keep low for a subtle backdrop. */
  opacity?: number;
}

/** Full-bleed particle canvas. Render absolutely-positioned behind content. */
export function ParticleField({ className, opacity = 0.6 }: ParticleFieldProps) {
  const [ready, setReady] = useState(false);

  return (
    <div
      className={className}
      style={{ opacity: ready ? opacity : 0, transition: "opacity 1.2s ease" }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
      >
        <Stars />
      </Canvas>
    </div>
  );
}

export default ParticleField;
