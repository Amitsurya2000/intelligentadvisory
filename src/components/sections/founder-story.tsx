"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Check,
  Sparkles,
  ArrowRight,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { founder } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Magnetic } from "@/components/shared/magnetic-button";
import { SpotlightCard } from "@/components/shared/spotlight-card";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Eye,
};

type Pillar = {
  key: string;
  label: string;
  icon: string;
  body: string;
  accent: "cyan" | "violet" | "fuchsia";
};

const pillars: Pillar[] = [
  {
    key: "mission",
    label: "Mission",
    icon: "Target",
    body: founder.mission,
    accent: "cyan",
  },
  {
    key: "vision",
    label: "Vision",
    icon: "Eye",
    body: founder.vision,
    accent: "violet",
  },
];

const accentText: Record<Pillar["accent"], string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};

const accentRing: Record<Pillar["accent"], string> = {
  cyan: "ring-brand-cyan/30",
  violet: "ring-brand-violet/30",
  fuchsia: "ring-brand-fuchsia/30",
};

const chipAccents = ["cyan", "violet", "fuchsia"] as const;

export function FounderStory() {
  const [photoErr, setPhotoErr] = useState(false);

  return (
    <section id="founder" className="section relative overflow-hidden">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-violet/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Leadership"
          align="center"
          title={
            <>
              The Mind Behind{" "}
              <span className="gradient-text-animated">Intelligent Systems</span>
            </>
          }
        />

        <div className="mt-16 grid items-start gap-10 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          {/* ---------------- Left: Portrait ---------------- */}
          <Reveal direction="right" className="lg:sticky lg:top-28">
            <div className="relative flex flex-col items-center">
              {/* Floating accent orbs */}
              <div
                aria-hidden
                className="pointer-events-none absolute -left-6 top-6 size-20 rounded-full bg-brand-cyan/20 blur-2xl animate-float"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 bottom-16 size-24 rounded-full bg-brand-fuchsia/20 blur-2xl animate-float-slow"
              />

              <div className="glass-strong relative w-full max-w-sm rounded-[2rem] p-8 text-center">
                {/* Gradient-ring avatar with monogram */}
                <div className="relative mx-auto flex size-36 items-center justify-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-brand-gradient p-[3px] animate-gradient-pan"
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    <div className="size-full rounded-full bg-brand-ink" />
                  </div>
                  <div className="relative size-32 overflow-hidden rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                    {founder.photo && !photoErr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={founder.photo}
                        alt={founder.name}
                        loading="lazy"
                        onError={() => setPhotoErr(true)}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div
                        className="grid size-full place-items-center font-display text-4xl font-bold tracking-tight text-foreground"
                        aria-label={`${founder.name} monogram`}
                      >
                        <span className="gradient-text">{founder.avatar}</span>
                      </div>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 right-2 flex size-7 items-center justify-center rounded-full bg-brand-ink ring-2 ring-brand-cyan/40"
                  >
                    <Sparkles className="size-3.5 text-brand-cyan" />
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">
                  {founder.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {founder.role}
                </p>

                {/* Stat chips */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {founder.stats.map((stat, i) => {
                    const accent = chipAccents[i % chipAccents.length];
                    return (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 320, damping: 20 }}
                        className="glass flex flex-col items-center rounded-xl px-4 py-2.5"
                      >
                        <span
                          className={cn(
                            "font-display text-lg font-bold leading-none",
                            accentText[accent]
                          )}
                        >
                          {stat.value}
                        </span>
                        <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Signature flourish */}
                <div className="mt-7 border-t border-border/60 pt-5">
                  <p
                    className="gradient-text text-2xl"
                    style={{ fontFamily: "var(--font-display), cursive", fontStyle: "italic" }}
                  >
                    {founder.name}
                  </p>
                  <svg
                    aria-hidden
                    viewBox="0 0 200 12"
                    className="mx-auto mt-1 h-3 w-40 text-brand-violet/60"
                  >
                    <path
                      d="M2 8 C40 2, 70 11, 110 5 S180 2, 198 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------------- Right: Story ---------------- */}
          <div className="flex flex-col gap-8">
            {/* Mission / Vision blocks */}
            <div className="grid gap-5 sm:grid-cols-2">
              {pillars.map((pillar, i) => {
                const Icon: LucideIcon =
                  (iconMap[pillar.icon] as LucideIcon) ?? Target;
                return (
                  <Reveal key={pillar.key} delay={0.05 * i} direction="up">
                    <SpotlightCard accent={pillar.accent} className="h-full p-6">
                      <div
                        className={cn(
                          "flex size-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1",
                          accentRing[pillar.accent]
                        )}
                      >
                        <Icon className={cn("size-5", accentText[pillar.accent])} />
                      </div>
                      <h3 className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {pillar.label}
                      </h3>
                      <p className="mt-2 text-pretty text-[15px] leading-relaxed text-foreground/90">
                        {pillar.body}
                      </p>
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>

            {/* Story */}
            <Reveal delay={0.1}>
              <figure className="glass relative rounded-2xl p-6 md:p-7">
                <Quote
                  aria-hidden
                  className="absolute -top-3 left-6 size-7 text-brand-cyan/50"
                />
                <blockquote className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {founder.story}
                </blockquote>
              </figure>
            </Reveal>

            {/* Signature line */}
            <Reveal delay={0.11}>
              <p className="border-l-2 border-brand-cyan pl-4 font-display text-lg font-bold leading-snug text-white md:text-xl">
                {founder.quote}
              </p>
            </Reveal>

            {/* Expertise checklist */}
            <Reveal delay={0.12}>
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  What we bring
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {founder.expertise.map((item, i) => {
                    const accent = chipAccents[i % chipAccents.length];
                    const Mark = i % 2 === 0 ? Check : Sparkles;
                    return (
                      <li
                        key={item}
                        className="glass flex items-start gap-3 rounded-xl px-4 py-3"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ring-1",
                            accentRing[accent]
                          )}
                        >
                          <Mark className={cn("size-3", accentText[accent])} />
                        </span>
                        <span className="text-sm leading-snug text-foreground/90">
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.16}>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Magnetic>
                  <Button asChild size="lg">
                    <a href={siteConfig.bookingUrl}>
                      Connect with {founder.name.split(" ")[0]}
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </Magnetic>
                <p className="text-sm text-muted-foreground">
                  Have a hard problem? Let&apos;s talk through it — no pitch, just signal.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
