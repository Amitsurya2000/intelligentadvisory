"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  BrainCircuit,
  Magnet,
  Database,
  Headset,
  LineChart,
  Settings2,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ecosystemCore, ecosystemNodes, type EcosystemNode } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Magnet,
  Database,
  Headset,
  LineChart,
  Settings2,
  Megaphone,
};

const ACCENTS = ["cyan", "violet", "fuchsia"] as const;
type Accent = (typeof ACCENTS)[number];

const ACCENT_HEX: Record<Accent, string> = {
  cyan: "#22d3ee",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
};

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-brand-cyan/50",
  violet: "border-brand-violet/50",
  fuchsia: "border-brand-fuchsia/50",
};

/* Geometry: SVG viewBox is 1000x1000, center at (500,500). */
const CENTER = 500;
const RADIUS = 400;

function nodePoint(index: number, total: number) {
  // Start at top (-90deg) and distribute evenly clockwise.
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
    angle,
  };
}

export function AIEcosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [active, setActive] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const CoreIcon = iconMap[ecosystemCore.icon];
  const total = ecosystemNodes.length;
  const points = ecosystemNodes.map((_, i) => nodePoint(i, total));

  return (
    <section id="ecosystem" className="section relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 blur-3xl"
        aria-hidden
      />
      <div ref={sectionRef} className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Connected intelligence"
          title={
            <>
              One <span className="gradient-text">AI Agent Core</span>, orchestrating your entire
              stack
            </>
          }
          description="A single reasoning brain plugs into every tool you run — sensing, deciding, and acting across your whole operation in real time."
        />

        {/* ---------- Radial constellation (desktop / lg and up) ---------- */}
        <div className="mt-16 hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-[820px]">
            {/* SVG connection layer */}
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id={`stroke-${gradId}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
                <radialGradient id={`core-${gradId}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* orbit ring — the perfect circle the nodes rotate on */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={`url(#stroke-${gradId})`}
                strokeOpacity={0.32}
                strokeWidth={2.5}
                strokeDasharray="2 9"
              />
              <circle cx={CENTER} cy={CENTER} r={170} fill={`url(#core-${gradId})`} />

              {points.map((p, i) => {
                const node = ecosystemNodes[i];
                const isActive = active === node.id;
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <g key={node.id}>
                    <line
                      x1={CENTER}
                      y1={CENTER}
                      x2={p.x}
                      y2={p.y}
                      stroke={`url(#stroke-${gradId})`}
                      strokeWidth={isActive ? 3 : 1.5}
                      strokeOpacity={isActive ? 0.95 : 0.35}
                      strokeLinecap="round"
                      style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
                    />
                    {/* flowing data packet */}
                    {!reduced && (
                      <circle r={isActive ? 7 : 4.5} fill={ACCENT_HEX[accent]}>
                        <animateMotion
                          dur={`${2.4 + (i % 3) * 0.5}s`}
                          repeatCount="indefinite"
                          path={`M${CENTER},${CENTER} L${p.x},${p.y}`}
                          keyPoints="0;1"
                          keyTimes="0;1"
                          calcMode="linear"
                          begin={`${i * 0.35}s`}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.15;0.85;1"
                          dur={`${2.4 + (i % 3) * 0.5}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.35}s`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Rotating / breathing wrapper for the HTML nodes */}
            <div className="absolute inset-0 animate-orbit">
              {points.map((p, i) => {
                const node = ecosystemNodes[i];
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${(p.x / 1000) * 100}%`,
                      top: `${(p.y / 1000) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 180, damping: 18 }}
                  >
                    {/* counter-rotate so labels stay upright */}
                    <div className="animate-orbit-reverse">
                      <NodeChip
                        node={node}
                        accent={accent}
                        active={active === node.id}
                        onActivate={(v) => setActive(v ? node.id : null)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Center core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <CoreNode CoreIcon={CoreIcon} reduced={reduced} />
            </div>
          </div>
        </div>

        {/* ---------- Mobile + tablet stacked layout ---------- */}
        <div className="mt-12 flex flex-col gap-4 lg:hidden">
          <CoreNode CoreIcon={CoreIcon} reduced={reduced} mobile />
          <div className="relative ml-6 flex flex-col gap-3 border-l border-dashed border-brand-violet/30 pl-6">
            {ecosystemNodes.map((node, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const Icon = iconMap[node.icon];
              return (
                <div
                  key={node.id}
                  className={cn(
                    "glass relative rounded-2xl border p-4",
                    ACCENT_BORDER[accent]
                  )}
                >
                  <span
                    className="absolute -left-[1.65rem] top-1/2 h-px w-5 -translate-y-1/2"
                    style={{ background: ACCENT_HEX[accent] }}
                    aria-hidden
                  />
                  <span
                    className="absolute -left-[1.9rem] top-1/2 size-2 -translate-y-1/2 rounded-full"
                    style={{ background: ACCENT_HEX[accent], boxShadow: `0 0 12px ${ACCENT_HEX[accent]}` }}
                    aria-hidden
                  />
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl bg-white/5",
                        ACCENT_TEXT[accent]
                      )}
                    >
                      {Icon ? <Icon className="size-5" /> : null}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        {node.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {node.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Center core node -------------------------- */
function CoreNode({
  CoreIcon,
  reduced,
  mobile = false,
}: {
  CoreIcon?: React.ComponentType<{ className?: string }>;
  reduced: boolean;
  mobile?: boolean;
}) {
  return (
    <div className={cn("relative grid place-items-center", mobile ? "w-fit" : "")}>
      {!reduced && (
        <>
          <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-brand-violet/30 blur-2xl" />
          <motion.span
            className="absolute rounded-full border border-brand-cyan/40"
            style={{ width: mobile ? 96 : 150, height: mobile ? 96 : 150 }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, ease: "easeOut", repeat: Infinity }}
            aria-hidden
          />
        </>
      )}
      <div
        className={cn(
          "glass-strong relative grid place-items-center rounded-full border border-white/15 glow-violet",
          mobile ? "size-24" : "size-40"
        )}
      >
        <div className="bg-brand-gradient absolute inset-1 rounded-full opacity-20 blur-md" aria-hidden />
        <div className="relative flex flex-col items-center gap-1 text-center">
          <span className={cn("grid place-items-center text-brand-cyan", mobile ? "" : "")}>
            {CoreIcon ? <CoreIcon className={mobile ? "size-8" : "size-12"} /> : null}
          </span>
          <span
            className={cn(
              "font-mono uppercase tracking-wider text-foreground",
              mobile ? "text-xs" : "text-base"
            )}
          >
            {ecosystemCore.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Orbiting node chip -------------------------- */
function NodeChip({
  node,
  accent,
  active,
  onActivate,
}: {
  node: EcosystemNode;
  accent: Accent;
  active: boolean;
  onActivate: (v: boolean) => void;
}) {
  const Icon = iconMap[node.icon];
  return (
    <div
      className="group relative"
      onMouseEnter={() => onActivate(true)}
      onMouseLeave={() => onActivate(false)}
    >
      <button
        type="button"
        aria-label={`${node.label}: ${node.description}`}
        aria-expanded={active}
        onFocus={() => onActivate(true)}
        onBlur={() => onActivate(false)}
        className={cn(
          "glass flex h-[5rem] w-[13.5rem] items-center gap-3 rounded-2xl border px-4 text-left outline-none transition-all duration-300",
          "focus-visible:ring-2 focus-visible:ring-brand-cyan/70",
          active ? cn(ACCENT_BORDER[accent], "scale-[1.06] -translate-y-0.5") : "border-white/10 hover:border-white/20"
        )}
        style={active ? { boxShadow: `0 0 24px ${ACCENT_HEX[accent]}55` } : undefined}
      >
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-lg bg-white/5 transition-colors",
            ACCENT_TEXT[accent]
          )}
        >
          {Icon ? <Icon className="size-[1.5rem]" /> : null}
        </span>
        <span className="font-display text-[1.25rem] font-semibold leading-tight text-foreground">
          {node.label}
        </span>
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "glass-strong absolute left-1/2 top-full z-20 mt-3 w-56 -translate-x-1/2 rounded-xl border p-3 text-center",
              ACCENT_BORDER[accent]
            )}
          >
            <p className={cn("font-mono text-[10px] uppercase tracking-wider", ACCENT_TEXT[accent])}>
              {node.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{node.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
