"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RADIUS = 2.15;

/* -------------------------------------------------------------------------- */
/*  Geometry helpers                                                           */
/* -------------------------------------------------------------------------- */

function fibonacciSphere(count: number, radius: number) {
  const out: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    out.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return out;
}

/* deterministic pseudo-random so SSR/CSR + reduced-motion stay stable */
function rng(seed: number) {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}

/* -------------------------------------------------------------------------- */
/*  Shader source                                                              */
/* -------------------------------------------------------------------------- */

const nodeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSeed;
  varying float vSeed;
  varying float vPulse;
  void main() {
    vSeed = aSeed;
    float pulse = 0.55 + 0.45 * sin(uTime * 1.5 + aPhase * 6.2831853);
    vPulse = pulse;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * (0.7 + 0.6 * pulse) * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const nodeFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorHub;
  varying float vSeed;
  varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    col = mix(col, uColorHub, step(0.93, vSeed));       // hubs warmer
    float alpha = core * (0.45 + 0.55 * vPulse);
    gl_FragColor = vec4(col, alpha);
  }
`;

const linkVertex = /* glsl */ `
  attribute float aDist;
  attribute float aSeed;
  varying float vDist;
  varying float vSeed;
  void main() {
    vDist = aDist;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const linkFragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vDist;
  varying float vSeed;
  void main() {
    // faint base wire + a bright "data packet" travelling along the link
    float m = fract(vDist - uTime * 0.16 + vSeed);
    float packet = pow(1.0 - m, 7.0);
    float glow = 0.05 + packet * 0.9;
    vec3 col = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(col, glow);
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
    float i = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
    gl_FragColor = vec4(uColor, 1.0) * i * 0.4;
  }
`;

/* -------------------------------------------------------------------------- */
/*  The intelligence sphere                                                    */
/* -------------------------------------------------------------------------- */

function IntelligenceSphere({ reduced, lowPerf }: { reduced: boolean; lowPerf: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shellA = useRef<THREE.Mesh>(null);
  const shellB = useRef<THREE.Mesh>(null);
  const nodeMat = useRef<THREE.ShaderMaterial>(null);
  const linkMat = useRef<THREE.ShaderMaterial>(null);

  const NODE_COUNT = lowPerf ? 260 : 520;
  const PARTICLES = lowPerf ? 140 : 300;

  // --- Nodes (glowing intelligence points, 6 marked as service hubs) --------
  const { nodeGeom, nodes } = useMemo(() => {
    const nodes = fibonacciSphere(NODE_COUNT, RADIUS);
    const pos = new Float32Array(NODE_COUNT * 3);
    const size = new Float32Array(NODE_COUNT);
    const phase = new Float32Array(NODE_COUNT);
    const seed = new Float32Array(NODE_COUNT);

    // 6 evenly spaced service hubs.
    const hubStep = Math.floor(NODE_COUNT / 6);
    const hubSet = new Set([0, hubStep, hubStep * 2, hubStep * 3, hubStep * 4, hubStep * 5]);

    nodes.forEach((v, i) => {
      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
      const isHub = hubSet.has(i);
      size[i] = isHub ? 3.4 : 0.55 + rng(i + 1) * 0.85;
      phase[i] = rng(i + 7);
      seed[i] = isHub ? 0.97 : rng(i + 13) * 0.85;
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return { nodeGeom: g, nodes };
  }, [NODE_COUNT]);

  // --- Neural links between nearby nodes ------------------------------------
  const linkGeom = useMemo(() => {
    const threshold = RADIUS * 0.5;
    const maxNeighbors = 3;
    const segPos: number[] = [];
    const segDist: number[] = [];
    const segSeed: number[] = [];
    const seen = new Set<number>();

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const near: Array<{ j: number; d: number }> = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const d = a.distanceTo(nodes[j]);
        if (d < threshold) near.push({ j, d });
      }
      near.sort((p, q) => p.d - q.d);
      for (let k = 0; k < Math.min(maxNeighbors, near.length); k++) {
        const j = near[k].j;
        const key = i < j ? i * nodes.length + j : j * nodes.length + i;
        if (seen.has(key)) continue;
        seen.add(key);
        const b = nodes[j];
        const s = rng(key);
        segPos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        segDist.push(0, 1);
        segSeed.push(s, s);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segPos), 3));
    g.setAttribute("aDist", new THREE.BufferAttribute(new Float32Array(segDist), 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(segSeed), 1));
    return g;
  }, [nodes]);

  // --- Ambient drifting particles -------------------------------------------
  const particleGeom = useMemo(() => {
    const pos = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      const r = RADIUS * (1.3 + rng(i + 31) * 0.9);
      const theta = rng(i + 53) * Math.PI * 2;
      const phi = Math.acos(2 * rng(i + 71) - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [PARTICLES]);

  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color("#4aa8ff") } },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (nodeMat.current) nodeMat.current.uniforms.uTime.value = t;
    if (linkMat.current) linkMat.current.uniforms.uTime.value = t;
    if (reduced) return;
    if (group.current) group.current.rotation.y += delta * 0.03;
    if (shellA.current) shellA.current.rotation.y -= delta * 0.05;
    if (shellB.current) shellB.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.08]}>
      {/* eslint-disable react/no-unknown-property */}
      {/* Holographic wireframe shells */}
      <mesh ref={shellA}>
        <icosahedronGeometry args={[RADIUS * 1.0, 2]} />
        <meshBasicMaterial color="#3b6fd4" wireframe transparent opacity={0.06} />
      </mesh>
      <mesh ref={shellB}>
        <icosahedronGeometry args={[RADIUS * 0.82, 1]} />
        <meshBasicMaterial color="#7c5cff" wireframe transparent opacity={0.05} />
      </mesh>

      {/* Neural links with travelling data packets */}
      <lineSegments geometry={linkGeom} frustumCulled={false}>
        <shaderMaterial
          ref={linkMat}
          vertexShader={linkVertex}
          fragmentShader={linkFragment}
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color("#38bdf8") },
            uColorB: { value: new THREE.Color("#8b5cf6") },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Glowing intelligence nodes + hubs */}
      <points geometry={nodeGeom} frustumCulled={false}>
        <shaderMaterial
          ref={nodeMat}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          uniforms={{
            uTime: { value: 0 },
            uSize: { value: lowPerf ? 0.07 : 0.09 },
            uColorA: { value: new THREE.Color("#67e8f9") },
            uColorB: { value: new THREE.Color("#a78bfa") },
            uColorHub: { value: new THREE.Color("#f5b8ff") },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient particles */}
      <points geometry={particleGeom} frustumCulled={false}>
        <pointsMaterial
          color="#9bd4ff"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>

      {/* Soft atmosphere halo */}
      <mesh scale={1.16} material={atmosphere}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
      </mesh>
      {/* eslint-enable react/no-unknown-property */}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Canvas wrapper (same prop shape as the old EarthCanvas)                     */
/* -------------------------------------------------------------------------- */

export function AISphereCanvas({
  reduced = false,
  dpr = [1, 1.5],
  lowPerf = false,
}: {
  reduced?: boolean;
  dpr?: [number, number];
  lowPerf?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={dpr}
      gl={{ antialias: !lowPerf, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Suspense fallback={null}>
        <IntelligenceSphere reduced={reduced} lowPerf={lowPerf} />
      </Suspense>
    </Canvas>
  );
}
