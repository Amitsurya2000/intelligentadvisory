"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Heavy client-only canvas — lazy-load so it never blocks first paint.
const AISphereCanvas = dynamic(() => import("./ai-sphere").then((m) => m.AISphereCanvas), {
  ssr: false,
});

interface Config {
  reduced: boolean;
  dpr: [number, number];
  lowPerf: boolean;
}

/**
 * Fixed, full-viewport AI intelligence sphere living BEHIND all content.
 *  - Hidden over the hero (#hero); fades in as the hero scrolls away.
 *  - Stays fixed + visible through the middle sections.
 *  - Fades out across the final CTA (#cta).
 *  - Subtle scroll parallax. Honors prefers-reduced-motion + mobile perf.
 */
export function IntelligenceBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPerf = window.matchMedia("(max-width: 768px)").matches;
    setConfig({ reduced, dpr: lowPerf ? [1, 1] : [1, 1.5], lowPerf });
  }, []);

  useEffect(() => {
    if (!config) return;
    const el = wrapRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(el, { opacity: 0 });
    const setOpacity = gsap.quickSetter(el, "opacity") as (v: number) => void;

    let fadeIn = 0;
    let fadeOut = 0;
    // Cap overall brightness so content stays readable over the network.
    const MAX_OPACITY = 0.45;
    const apply = () => setOpacity(Math.max(0, Math.min(fadeIn, 1 - fadeOut)) * MAX_OPACITY);

    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom 92%",
        end: "bottom 45%",
        onUpdate: (s) => {
          fadeIn = s.progress;
          apply();
        },
        onRefresh: (s) => {
          fadeIn = s.progress;
          apply();
        },
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: "#cta",
        start: "top 85%",
        end: "top 30%",
        onUpdate: (s) => {
          fadeOut = s.progress;
          apply();
        },
        onRefresh: (s) => {
          fadeOut = s.progress;
          apply();
        },
      })
    );

    let parallax: gsap.core.Tween | null = null;
    if (!config.reduced && innerRef.current) {
      parallax = gsap.to(innerRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      parallax?.scrollTrigger?.kill();
      parallax?.kill();
    };
  }, [config]);

  if (!config) return null;

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <div ref={innerRef} className="absolute inset-0">
        <AISphereCanvas reduced={config.reduced} dpr={config.dpr} lowPerf={config.lowPerf} />
      </div>
      {/* Readability scrim — darkens even the center so text always reads. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,6,12,0.45),rgba(5,6,12,0.88))]" />
    </div>
  );
}
