"use client";

import dynamic from "next/dynamic";

// Three.js canvas is client-only — load it lazily so it never blocks SSR/first paint.
const ParticleField = dynamic(
  () => import("./particle-field").then((m) => m.ParticleField),
  { ssr: false }
);

/**
 * Global fixed background layer: deep gradient + particle field + grid glow.
 * Rendered once in the root layout, sits behind all content.
 */
export function SceneBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* NOTE: no solid base fill here — the body background sits behind, and the
          fixed AI intelligence sphere (-z-20) shows through the transparent gaps.
          This layer is the "middle" stratum: brand glow + particles + grid. */}
      <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.10),transparent_60%)] blur-2xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_60%)] blur-2xl" />
      {/* Particle field */}
      <ParticleField className="absolute inset-0" opacity={0.55} />
      {/* Fine grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,6,12,0.9))]" />
    </div>
  );
}
