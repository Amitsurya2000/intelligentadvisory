"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

const accentColor = {
  cyan: "34,211,238",
  violet: "139,92,246",
  fuchsia: "217,70,239",
} as const;

/** Glass card with a cursor-following radial spotlight. The default premium card. */
export function SpotlightCard({
  children,
  className,
  accent = "cyan",
}: {
  children: ReactNode;
  className?: string;
  accent?: keyof typeof accentColor;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rgb = accentColor[accent];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(${rgb}, 0.12), transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      {/* Animated gradient hairline on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] p-px">
        <div
          className="h-full w-full rounded-2xl"
          style={{
            background: `linear-gradient(120deg, rgba(${rgb},0.5), transparent 40%, transparent 60%, rgba(${rgb},0.5))`,
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
