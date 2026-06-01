"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Target,
  Lightbulb,
  TrendingUp,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { caseStudies, type CaseStudy, type CaseStudyMetric } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Magnetic } from "@/components/shared/magnetic-button";

type Accent = CaseStudy["accent"];

const accentToken: Record<
  Accent,
  {
    text: string;
    bg: string;
    border: string;
    ring: string;
    stroke: string;
    glow: string;
    badge: "cyan" | "violet" | "fuchsia";
    gradient: string;
  }
> = {
  cyan: {
    text: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    border: "border-brand-cyan/30",
    ring: "ring-brand-cyan/40",
    stroke: "#22d3ee",
    glow: "glow-cyan",
    badge: "cyan",
    gradient: "from-brand-cyan/20",
  },
  violet: {
    text: "text-brand-violet",
    bg: "bg-brand-violet/10",
    border: "border-brand-violet/30",
    ring: "ring-brand-violet/40",
    stroke: "#8b5cf6",
    glow: "glow-violet",
    badge: "violet",
    gradient: "from-brand-violet/20",
  },
  fuchsia: {
    text: "text-brand-fuchsia",
    bg: "bg-brand-fuchsia/10",
    border: "border-brand-fuchsia/30",
    ring: "ring-brand-fuchsia/40",
    stroke: "#d946ef",
    glow: "glow-violet",
    badge: "fuchsia",
    gradient: "from-brand-fuchsia/20",
  },
};

/** Decimals needed to faithfully render a metric value (e.g. 1.2 -> 1 decimal). */
function decimalsFor(value: number) {
  return Number.isInteger(value) ? 0 : 1;
}

/** Animated ring + counter for a single case-study metric — reads like a live dashboard tile. */
function MetricTile({
  metric,
  accent,
  index,
  reduced,
}: {
  metric: CaseStudyMetric;
  accent: Accent;
  index: number;
  reduced: boolean;
}) {
  const t = accentToken[accent];
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  // Visual fill is illustrative, staggered for rhythm — not a literal percentage.
  const fill = 0.62 + index * 0.13;
  const offset = circumference * (1 - fill);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
      <div className="relative grid place-items-center">
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-white/[0.07]"
            strokeWidth="5"
          />
          <motion.circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke={t.stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduced ? offset : circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: reduced ? 0 : 1.4,
              delay: reduced ? 0 : 0.2 + index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ filter: `drop-shadow(0 0 6px ${t.stroke}66)` }}
          />
        </svg>
        <div className="absolute size-2 rounded-full" style={{ background: t.stroke }} />
      </div>
      <AnimatedCounter
        value={metric.value}
        prefix={metric.prefix}
        suffix={metric.suffix}
        decimals={decimalsFor(metric.value)}
        className={cn("font-display text-2xl font-bold tabular-nums md:text-3xl", t.text)}
      />
      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {metric.label}
      </span>
    </div>
  );
}

function DetailBlock({
  icon: Icon,
  label,
  body,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  body: string;
  accent: Accent;
}) {
  const t = accentToken[accent];
  return (
    <div className="relative pl-9">
      <span
        className={cn(
          "absolute left-0 top-0.5 grid size-6 place-items-center rounded-md border",
          t.bg,
          t.border
        )}
      >
        <Icon className={cn("size-3.5", t.text)} />
      </span>
      <h4 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/90 md:text-[0.95rem]">
        {body}
      </p>
    </div>
  );
}

export function CaseStudies() {
  const [activeSlug, setActiveSlug] = useState(caseStudies[0].slug);
  const reduced = useReducedMotion() ?? false;
  const active = caseStudies.find((c) => c.slug === activeSlug) ?? caseStudies[0];
  const t = accentToken[active.accent];

  return (
    <section id="case-studies" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className={cn(
          "pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl transition-colors duration-700",
          t.bg
        )}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Proven outcomes"
          title={
            <>
              Real businesses. <span className="gradient-text">Measurable ROI.</span>
            </>
          }
          description="Hand-picked deployments where intelligent agents moved the metrics that matter. Switch between clients to watch the numbers come alive."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-8">
          {/* Client selector */}
          <div
            className="flex flex-col gap-3"
            role="tablist"
            aria-label="Case study clients"
          >
            {caseStudies.map((cs) => {
              const ct = accentToken[cs.accent];
              const isActive = cs.slug === active.slug;
              return (
                <button
                  key={cs.slug}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="case-study-panel"
                  onClick={() => setActiveSlug(cs.slug)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                    isActive
                      ? cn("glass-strong", ct.border, "ring-1", ct.ring)
                      : "glass border-white/[0.06] hover:border-white/15"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="case-active-bar"
                      className={cn(
                        "absolute inset-y-3 left-0 w-1 rounded-full",
                        ct.bg.replace("/10", "/80")
                      )}
                      style={{ background: ct.stroke }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "grid size-12 shrink-0 place-items-center rounded-xl border font-display text-sm font-bold transition-colors",
                        ct.border,
                        ct.bg,
                        ct.text,
                        isActive && ct.glow
                      )}
                    >
                      {cs.logo}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base font-semibold text-foreground">
                        {cs.client}
                      </p>
                      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                        {cs.industry}
                      </p>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "size-4 shrink-0 transition-all duration-300",
                        isActive
                          ? cn("opacity-100", ct.text)
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      )}
                    />
                  </div>
                </button>
              );
            })}

            <div className="mt-2 hidden lg:block">
              <Magnetic>
                <Button asChild size="lg" className="w-full">
                  <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Engineer your outcome
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* Detail panel */}
          <div
            id="case-study-panel"
            role="tabpanel"
            aria-live="polite"
            className="relative min-h-[30rem] overflow-hidden rounded-3xl border border-white/[0.07] glass-strong p-6 md:p-8"
          >
            <div
              className={cn(
                "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br to-transparent blur-3xl",
                t.gradient
              )}
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col gap-7"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "grid size-14 place-items-center rounded-2xl border font-display text-lg font-bold",
                        t.border,
                        t.bg,
                        t.text,
                        t.glow
                      )}
                      aria-hidden
                    >
                      {active.logo}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold md:text-2xl">
                        {active.client}
                      </h3>
                      <Badge variant={t.badge} className="mt-1.5">
                        {active.industry}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2.5",
                      t.border,
                      t.bg
                    )}
                  >
                    <TrendingUp className={cn("size-4", t.text)} />
                    <span className={cn("font-display text-base font-bold md:text-lg", t.text)}>
                      {active.roi}
                    </span>
                  </div>
                </div>

                {/* Story blocks */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <DetailBlock
                    icon={Target}
                    label="Challenge"
                    body={active.challenge}
                    accent={active.accent}
                  />
                  <DetailBlock
                    icon={Lightbulb}
                    label="Solution"
                    body={active.solution}
                    accent={active.accent}
                  />
                </div>

                <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <Quote
                    className={cn("mb-2 size-5 opacity-70", t.text)}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                    {active.results}
                  </p>
                </div>

                {/* Live data viz */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span className={cn("size-1.5 rounded-full animate-pulse-glow", t.text)} style={{ background: t.stroke }} />
                    Outcome metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {active.metrics.map((m, i) => (
                      <MetricTile
                        key={`${active.slug}-${m.label}`}
                        metric={m}
                        accent={active.accent}
                        index={i}
                        reduced={reduced}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile CTA */}
          <div className="lg:hidden">
            <Magnetic>
              <Button asChild size="lg" className="w-full">
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Engineer your outcome
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
