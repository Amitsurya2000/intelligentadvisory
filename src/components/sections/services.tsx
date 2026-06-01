"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Target,
  Filter,
  Database,
  Workflow,
  Rocket,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { services } from "@/lib/data";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/** Resolve lucide icon names from the data layer to components. */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Filter,
  Bot,
  Database,
  Workflow,
  Rocket,
};

type Accent = "cyan" | "violet" | "fuchsia";

const accentText: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};

const accentGlow: Record<Accent, string> = {
  cyan: "shadow-[0_0_40px_-12px_rgba(34,211,238,0.55)]",
  violet: "shadow-[0_0_40px_-12px_rgba(139,92,246,0.55)]",
  fuchsia: "shadow-[0_0_40px_-12px_rgba(217,70,239,0.55)]",
};

const accentTint: Record<Accent, string> = {
  cyan: "from-brand-cyan/25 to-brand-cyan/5 ring-brand-cyan/30",
  violet: "from-brand-violet/25 to-brand-violet/5 ring-brand-violet/30",
  fuchsia: "from-brand-fuchsia/25 to-brand-fuchsia/5 ring-brand-fuchsia/30",
};

const accentCheck: Record<Accent, string> = {
  cyan: "bg-brand-cyan/15 text-brand-cyan",
  violet: "bg-brand-violet/15 text-brand-violet",
  fuchsia: "bg-brand-fuchsia/15 text-brand-fuchsia",
};

export function ServicesSection() {
  return (
    <section id="services" className="section relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-violet/10 blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="What We Do"
          title={
            <>
              The Most <span className="gradient-text-animated">Ruthlessly Effective</span> Growth
              Systems on Planet Earth
            </>
          }
          description="Skip the guesswork. We deploy proven systems that flood your business with sales — media buying, funnels, AI agents, and automation that actually work."
        />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Bot;
            const accent = service.accent;

            return (
              <Reveal key={service.slug} className="h-full">
                <SpotlightCard accent={accent} className="h-full">
                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="flex h-full flex-col p-6 md:p-7"
                  >
                    {/* Icon tile */}
                    <motion.div
                      variants={{
                        rest: { rotate: 0, scale: 1 },
                        hover: { rotate: -6, scale: 1.06 },
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className={cn(
                        "relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset transition-shadow duration-300 group-hover:[box-shadow:var(--tw-shadow)]",
                        accentTint[accent],
                        accentGlow[accent]
                      )}
                    >
                      <Icon className={cn("size-7", accentText[accent])} />
                    </motion.div>

                    {/* Title + tagline */}
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className={cn("mt-1 font-mono text-xs uppercase tracking-wider", accentText[accent])}>
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    {/* Feature checklist */}
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/90">
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                              accentCheck[accent]
                            )}
                          >
                            <Check className="size-3" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Explore link */}
                    <div className="mt-auto pt-6">
                      <a
                        href="#contact"
                        className={cn(
                          "group/explore inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                          accentText[accent]
                        )}
                        aria-label={`Explore ${service.title}`}
                      >
                        <span>Explore</span>
                        <motion.span
                          variants={{
                            rest: { x: 0, y: 0 },
                            hover: { x: 3, y: -3 },
                          }}
                          transition={{ type: "spring", stiffness: 320, damping: 16 }}
                          className="inline-flex"
                          aria-hidden
                        >
                          <ArrowUpRight className="size-4" />
                        </motion.span>
                      </a>
                    </div>
                  </motion.div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
