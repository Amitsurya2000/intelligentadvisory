"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** A soft brand-colored glow that trails the cursor across the whole page. Desktop only. */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    // Skip on touch / coarse pointers and when reduced motion is requested.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-[500px] w-[500px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(34,211,238,0.10), rgba(139,92,246,0.06) 40%, transparent 70%)",
      }}
    />
  );
}
