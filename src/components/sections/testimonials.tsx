"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";

type Accent = Testimonial["accent"];

const accentRing: Record<Accent, string> = {
  cyan: "from-brand-cyan/80 to-brand-cyan/20",
  violet: "from-brand-violet/80 to-brand-violet/20",
  fuchsia: "from-brand-fuchsia/80 to-brand-fuchsia/20",
};

const accentText: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};

const accentBar: Record<Accent, string> = {
  cyan: "bg-brand-cyan",
  violet: "bg-brand-violet",
  fuchsia: "bg-brand-fuchsia",
};

const accentDot: Record<Accent, string> = {
  cyan: "bg-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]",
  violet: "bg-brand-violet shadow-[0_0_12px_rgba(139,92,246,0.8)]",
  fuchsia: "bg-brand-fuchsia shadow-[0_0_12px_rgba(217,70,239,0.8)]",
};

/** Deterministic faux audio waveform so each card implies a "video" clip. */
function Waveform({ accent, seed }: { accent: Accent; seed: number }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const v = Math.abs(Math.sin((i + seed) * 1.7) * Math.cos((i + seed) * 0.6));
        return 18 + Math.round(v * 82);
      }),
    [seed]
  );
  return (
    <div className="flex h-7 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full opacity-60", accentBar[accent])}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function Stars({ rating, accent }: { rating: number; accent: Accent }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? cn("fill-current", accentText[accent]) : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function AvatarRing({ avatar, accent }: { avatar: string; accent: Accent }) {
  return (
    <div className={cn("rounded-full bg-gradient-to-br p-px", accentRing[accent])}>
      <div className="flex size-12 items-center justify-center rounded-full bg-brand-ink font-mono text-sm font-semibold tracking-wide text-foreground">
        {avatar}
      </div>
    </div>
  );
}

/** Compact "video player" testimonial card used inside the marquee. */
function MarqueeCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <SpotlightCard accent={t.accent} className="h-full w-[340px] shrink-0 sm:w-[380px]">
      <figure className="flex h-full flex-col gap-4 p-5">
        {/* Faux video frame */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-grid bg-brand-ink/60 px-4 py-4">
          <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.06]" />
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              aria-label={`Play testimonial from ${t.name}`}
              className={cn(
                "group/play flex size-10 shrink-0 items-center justify-center rounded-full glass-strong transition-transform duration-300 hover:scale-110",
                accentText[t.accent]
              )}
            >
              <Play className="size-4 translate-x-[1px] fill-current" />
            </button>
            <div className="flex-1">
              <Waveform accent={t.accent} seed={index + 1} />
            </div>
          </div>
          <div className="relative mt-3 flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">00:0{(index % 6) + 1}</span>
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-border">
              <span
                className={cn("absolute inset-y-0 left-0 rounded-full", accentBar[t.accent])}
                style={{ width: `${30 + index * 12}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">01:12</span>
          </div>
        </div>

        <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
          <AvatarRing avatar={t.avatar} accent={t.accent} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold">{t.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {t.role} <span className={accentText[t.accent]}>@</span> {t.company}
            </p>
          </div>
          <Stars rating={t.rating} accent={t.accent} />
        </figcaption>
      </figure>
    </SpotlightCard>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = testimonials[active];

  // Auto-rotate the featured quote; pause on user interaction with dots.
  useEffect(() => {
    if (paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  const track = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-[0.07] blur-[120px]" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Loved by operators"
          title={
            <>
              Teams that deployed their{" "}
              <span className="gradient-text-animated">AI workforce</span>
            </>
          }
          description="Real operators, real production deployments. Hear how intelligent agents reshaped the way their teams work."
        />

        {/* Featured rotating spotlight quote */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="gradient-border rounded-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-card/80 p-8 md:p-10">
              <Quote
                className={cn(
                  "absolute -right-4 -top-4 size-28 opacity-10",
                  accentText[featured.accent]
                )}
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                <motion.figure
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col gap-6"
                >
                  <Stars rating={featured.rating} accent={featured.accent} />
                  <blockquote className="text-balance font-display text-xl font-medium leading-snug text-foreground md:text-2xl">
                    &ldquo;{featured.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    <AvatarRing avatar={featured.avatar} accent={featured.accent} />
                    <div>
                      <p className="font-display text-base font-semibold">{featured.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {featured.role} <span className={accentText[featured.accent]}>@</span>{" "}
                        {featured.company}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          {/* Clickable dots */}
          <div className="mt-6 flex items-center justify-center gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                aria-label={`Show testimonial from ${t.name}`}
                aria-current={i === active}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active
                    ? cn("w-7", accentDot[t.accent])
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auto-scrolling marquee of video-style cards */}
      <div
        className="group relative mt-16 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-5 px-6 animate-marquee group-hover:[animation-play-state:paused]"
          aria-hidden="false"
        >
          {track.map((t, i) => (
            <MarqueeCard key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
