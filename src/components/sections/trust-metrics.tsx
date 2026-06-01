"use client";

import { type Variants, motion } from "framer-motion";
import { Clock, HeartHandshake, Rocket, Workflow } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { RevealGroup } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { metrics } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Map of the lucide icon names used by the metrics data to components. */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Workflow,
  Clock,
  HeartHandshake,
};

const accents = ["cyan", "violet", "fuchsia", "cyan"] as const;
type Accent = (typeof accents)[number];

const accentText: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};

/** Card entrance variants — children of RevealGroup inherit "hidden"/"visible". */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TrustMetrics() {
  return (
    <section id="metrics" className="section relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-brand-violet/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Proven Results"
          title={
            <>
              Intelligence <span className="gradient-text">Delivers</span>
            </>
          }
        />

        {/* Metric counters */}
        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.12}
        >
          {metrics.map((metric, i) => {
            const accent = accents[i % accents.length];
            const Icon = iconMap[metric.icon] ?? Rocket;
            return (
              <motion.div key={metric.label} variants={cardVariants}>
                <SpotlightCard accent={accent} className="h-full">
                  <div className="flex h-full flex-col gap-4 p-6 sm:p-7">
                    <span
                      className={cn(
                        "inline-flex size-11 items-center justify-center rounded-xl border border-border bg-white/[0.03]",
                        accentText[accent]
                      )}
                    >
                      <Icon className="size-5" />
                    </span>

                    <p className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                      <AnimatedCounter
                        value={metric.value}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        className="gradient-text"
                      />
                    </p>

                    <div className="mt-auto">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {metric.label}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
