"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  ClipboardList,
  Bot,
  UserX,
  Workflow,
  Hourglass,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowDown,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { beforeAfter } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/magnetic-button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList,
  Bot,
  UserX,
  Workflow,
  Hourglass,
  Zap,
  TrendingUp,
  TrendingDown,
};

function Glyph({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} />;
}

export function BusinessProblems() {
  const trackRef = useRef<HTMLDivElement>(null);
  // 0 = fully "before" revealed, 100 = fully "after" revealed.
  const reveal = useMotionValue(50);
  const [pct, setPct] = useState(50);
  useMotionValueEvent(reveal, "change", (v) => setPct(Math.round(v)));

  // Measure the real track width so the AFTER overlay renders full-width
  // content (clipped), instead of squishing into the revealed sliver.
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Width of the "after" overlay (revealed from the right).
  const afterWidth = useTransform(reveal, (v) => `${v}%`);
  const handleLeft = useTransform(reveal, (v) => `${100 - v}%`);

  const moveTo = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratioFromLeft = (clientX - rect.left) / rect.width;
    const next = Math.min(100, Math.max(0, (1 - ratioFromLeft) * 100));
    reveal.set(next);
  };

  const dragging = useRef(false);
  const onDown = (clientX: number) => {
    dragging.current = true;
    moveTo(clientX);
  };
  const onMove = (clientX: number) => {
    if (dragging.current) moveTo(clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <section id="problems" className="section relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="animate-float-slow pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-brand-violet/20 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          align="center"
          eyebrow="The transformation"
          title={
            <>
              From <span className="text-zinc-500 line-through decoration-rose-500/50">manual chaos</span>{" "}
              to <span className="gradient-text-animated">autonomous flow</span>
            </>
          }
          description="Drag the AI pivot across each row to watch the heavy, manual reality dissolve into an autonomous, agent-driven operation."
        />

        {/* Desktop: draggable before/after comparison slider */}
        <Reveal className="mt-12 hidden md:block">
          <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 text-rose-300/70">
              <span className="h-2 w-2 rounded-full bg-rose-400/60" /> Before · manual
            </span>
            <span className="flex items-center gap-2 text-brand-cyan">
              AI-powered · after{" "}
              <span className="glow-cyan h-2 w-2 rounded-full bg-brand-cyan" />
            </span>
          </div>

          {/* Comparison track */}
          <div
            ref={trackRef}
            className="glass relative isolate select-none overflow-hidden rounded-3xl border border-border/60"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              onDown(e.clientX);
            }}
            onPointerMove={(e) => onMove(e.clientX)}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            role="slider"
            aria-label="Reveal the AI-powered transformation"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") reveal.set(Math.min(100, pct + 5));
              if (e.key === "ArrowLeft") reveal.set(Math.max(0, pct - 5));
            }}
          >
            {/* BASE LAYER: BEFORE (heavy, grey, glitchy) */}
            <div className="relative grayscale-[0.35]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-950/20 via-transparent to-transparent" />
              <ul className="divide-y divide-white/5">
                {beforeAfter.map((row, i) => (
                  <Row key={`before-${i}`} side="before" data={row.before} index={i} />
                ))}
              </ul>
            </div>

            {/* OVERLAY LAYER: AFTER (alive, glowing) clipped from the right */}
            <motion.div
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ width: afterWidth }}
              aria-hidden
            >
              {/* fixed-width inner so content doesn't squish while clipping */}
              <div
                className="absolute inset-y-0 right-0 h-full"
                style={{ width: trackWidth || "100%" }}
              >
                <div className="relative h-full bg-brand-ink/40">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-brand-cyan/10 via-brand-violet/5 to-transparent" />
                  <ul className="divide-y divide-white/5">
                    {beforeAfter.map((row, i) => (
                      <Row key={`after-${i}`} side="after" data={row.after} index={i} />
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* AI PIVOT HANDLE */}
            <motion.div
              className="absolute inset-y-0 z-20 flex w-0 items-center justify-center"
              style={{ left: handleLeft }}
            >
              <div className="absolute inset-y-3 w-px bg-gradient-to-b from-transparent via-brand-cyan to-transparent" />
              <div className="glass-strong glow-cyan flex h-12 w-12 -translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full border border-brand-cyan/50">
                <span className="absolute inset-0 animate-pulse-glow rounded-full" aria-hidden />
                <GripVertical className="h-4 w-4 text-brand-cyan" />
              </div>
              <span className="font-mono absolute -top-1 left-1/2 -translate-x-1/2 rounded-full border border-brand-cyan/40 bg-brand-ink/80 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand-cyan">
                AI
              </span>
            </motion.div>
          </div>

          {/* Live readout */}
          <div className="mt-4 flex items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{100 - pct}% legacy</span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-brand-gradient"
                style={{ width: afterWidth }}
              />
            </div>
            <span className="text-brand-cyan">{pct}% autonomous</span>
          </div>
        </Reveal>

        {/* Mobile: stacked before → after (no slider, full text always visible) */}
        <div className="mt-10 space-y-4 md:hidden">
          <div className="glass overflow-hidden rounded-3xl border border-rose-500/20">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-rose-300/70">
              <span className="h-2 w-2 rounded-full bg-rose-400/60" /> Before · manual
            </div>
            <ul className="divide-y divide-white/5">
              {beforeAfter.map((row, i) => (
                <Row key={`mb-${i}`} side="before" data={row.before} index={i} mirror={false} />
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <span className="glow-cyan grid size-9 place-items-center rounded-full border border-brand-cyan/40 bg-brand-ink text-brand-cyan">
              <ArrowDown className="size-4" />
            </span>
          </div>

          <div className="glass overflow-hidden rounded-3xl border border-brand-cyan/30">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-cyan">
              AI-powered · after <span className="glow-cyan h-2 w-2 rounded-full bg-brand-cyan" />
            </div>
            <ul className="divide-y divide-white/5">
              {beforeAfter.map((row, i) => (
                <Row key={`ma-${i}`} side="after" data={row.after} index={i} mirror={false} />
              ))}
            </ul>
          </div>
        </div>

        {/* CTA line */}
        <Reveal delay={0.15} className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="max-w-xl text-sm text-muted-foreground">
            Every row above maps to a workflow we can automate for you — usually within weeks, not quarters.
          </p>
          <Magnetic>
            <Button asChild size="lg">
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                Map my transformation
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

function Row({
  side,
  data,
  index,
  mirror = true,
}: {
  side: "before" | "after";
  data: { title: string; detail: string; icon: string };
  index: number;
  mirror?: boolean;
}) {
  const isAfter = side === "after";
  return (
    <li
      className={cn(
        "flex items-center gap-4 px-5 py-5 sm:px-7 sm:py-6",
        // Mirror the AFTER rows to the right (only in the desktop slider) so
        // their text sits where the slider reveals.
        isAfter && mirror && "flex-row-reverse text-right"
      )}
    >
      <div
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
          isAfter
            ? "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan glow-cyan"
            : "border-rose-500/20 bg-white/[0.03] text-zinc-400"
        )}
      >
        <Glyph name={data.icon} className="h-5 w-5" />
        {isAfter && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-cyan" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={data.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className={cn(
                "truncate font-display text-base font-semibold sm:text-lg",
                isAfter ? "text-foreground" : "text-zinc-300"
              )}
            >
              {data.title}
            </p>
            <p
              className={cn(
                "mt-0.5 line-clamp-2 text-xs sm:text-sm",
                isAfter ? "text-muted-foreground" : "text-zinc-500"
              )}
            >
              {data.detail}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <span
        className={cn(
          "font-mono hidden shrink-0 text-[10px] uppercase tracking-widest sm:block",
          isAfter ? "text-brand-cyan/70" : "text-zinc-600"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </li>
  );
}
