"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { showcase, type ShowcaseItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import gsap from "gsap";

const cardGradient: Record<ShowcaseItem["accent"], string> = {
  cyan: "from-cyan-400 via-cyan-600 to-teal-700",
  violet: "from-violet-500 via-violet-700 to-indigo-800",
  fuchsia: "from-fuchsia-500 via-fuchsia-700 to-rose-800",
  ink: "from-zinc-700 via-zinc-900 to-black",
};

/* -------------------------------------------------------------------------- */
/*  Card (visual only — scale/opacity are driven by the carousel)             */
/* -------------------------------------------------------------------------- */

function ShowcaseCard({ item, active }: { item: ShowcaseItem; active: boolean }) {
  return (
    <article
      className={cn(
        "group/card relative h-[26rem] w-[19rem] overflow-hidden rounded-3xl border transition-[box-shadow,filter] duration-500 sm:w-[21rem]",
        active
          ? "border-white/25 shadow-[0_40px_120px_-25px_rgba(0,0,0,0.85),0_0_60px_-12px_rgba(34,211,238,0.35)] brightness-110"
          : "border-white/10 shadow-2xl brightness-[0.85]"
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", cardGradient[item.accent])} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-start justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/75">
            {item.category}
          </span>
          <ArrowUpRight className="size-5 text-white/70 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
        </div>

        <h3 className="mt-3 max-w-[12ch] font-display text-2xl font-extrabold uppercase leading-[1.05] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-3xl">
          {item.title}
        </h3>

        <div className="mt-auto">
          <div className="overflow-hidden rounded-xl border border-white/20 bg-black/30 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
              <span className="size-2 rounded-full bg-white/40" />
              <span className="size-2 rounded-full bg-white/30" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="ml-2 h-2 w-20 rounded bg-white/15" />
            </div>
            <div className="relative h-28 bg-gradient-to-br from-white/15 to-white/[0.03]">
              <div className="absolute left-3 top-3 h-2 w-24 rounded bg-white/25" />
              <div className="absolute left-3 top-7 h-2 w-16 rounded bg-white/15" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 backdrop-blur">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/60">
                  Result
                </span>
                <span className="font-display text-sm font-bold text-white">{item.result}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Glass navigation arrow                                                     */
/* -------------------------------------------------------------------------- */

function NavArrow({
  dir,
  disabled,
  onClick,
  className,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = dir === "left" ? ArrowLeft : ArrowRight;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={cn(
        "absolute top-1/2 z-30 hidden size-12 -translate-y-1/2 place-items-center rounded-full border md:grid",
        "glass-strong border-white/15 text-foreground backdrop-blur-xl",
        "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] transition-[box-shadow,border-color,color,opacity] duration-300",
        disabled
          ? "pointer-events-none opacity-25"
          : "hover:border-brand-cyan/40 hover:text-brand-cyan hover:shadow-[0_0_34px_-4px_rgba(34,211,238,0.55)]",
        className
      )}
    >
      <Icon className="size-5" />
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Carousel                                                                   */
/* -------------------------------------------------------------------------- */

export function Showcase() {
  const scroller = useRef<HTMLDivElement>(null);
  const slides = useRef<Array<HTMLDivElement | null>>([]);
  const reduced = useRef(false);

  const [pad, setPad] = useState(0);
  const [active, setActive] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Side padding lets the first & last cards reach dead-center.
  const computePad = useCallback(() => {
    const c = scroller.current;
    const first = slides.current[0];
    if (!c || !first) return;
    setPad(Math.max(0, (c.clientWidth - first.offsetWidth) / 2));
  }, []);

  // Per-frame: nearest-to-center card → active + scale/opacity falloff; edges.
  const update = useCallback(() => {
    const c = scroller.current;
    if (!c) return;
    const center = c.scrollLeft + c.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;

    slides.current.forEach((s, i) => {
      if (!s) return;
      const sCenter = s.offsetLeft + s.offsetWidth / 2;
      const dist = Math.abs(sCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
      const norm = Math.min(dist / (s.offsetWidth * 1.15), 1);
      s.style.transform = `scale(${(1.06 - norm * 0.16).toFixed(3)})`;
      s.style.opacity = `${(1 - norm * 0.45).toFixed(3)}`;
    });

    setActive(best);
    setCanLeft(c.scrollLeft > 4);
    setCanRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 4);
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    computePad();
    window.addEventListener("resize", computePad);
    return () => window.removeEventListener("resize", computePad);
  }, [computePad]);

  // Scroll listener (rAF-throttled) + recompute after padding changes.
  useEffect(() => {
    const c = scroller.current;
    if (!c) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      c.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update, pad]);

  // Mouse wheel → horizontal scroll (trackpad horizontal & touch are native).
  useEffect(() => {
    const c = scroller.current;
    if (!c) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal
      const atStart = c.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = c.scrollLeft >= c.scrollWidth - c.clientWidth && e.deltaY > 0;
      if (atStart || atEnd) return; // let the page scroll at the edges
      e.preventDefault();
      c.scrollLeft += e.deltaY;
    };
    c.addEventListener("wheel", onWheel, { passive: false });
    return () => c.removeEventListener("wheel", onWheel);
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const c = scroller.current;
    const s = slides.current[i];
    if (!c || !s) return;
    const target = s.offsetLeft + s.offsetWidth / 2 - c.clientWidth / 2;
    const clamped = Math.max(0, Math.min(target, c.scrollWidth - c.clientWidth));
    if (reduced.current) {
      c.scrollLeft = clamped;
      return;
    }
    gsap.to(c, { scrollLeft: clamped, duration: 0.8, ease: "expo.out", overwrite: true });
  }, []);

  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(showcase.length - 1, active + 1));

  return (
    <section id="showcase" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Become our <span className="gradient-text">next success story</span>
            </>
          }
          description="A glimpse of the systems we've shipped — each one a business now compounding on autopilot."
        />
      </div>

      {/* Carousel viewport */}
      <div className="relative mt-14">
        <NavArrow dir="left" disabled={!canLeft} onClick={prev} className="left-2 lg:left-6" />
        <NavArrow dir="right" disabled={!canRight} onClick={next} className="right-2 lg:right-6" />

        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <div
          ref={scroller}
          className="no-scrollbar flex gap-6 overflow-x-auto overflow-y-hidden py-6"
          style={{ paddingLeft: pad, paddingRight: pad }}
        >
          {showcase.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              ref={(el) => {
                slides.current[i] = el;
              }}
              className="shrink-0 will-change-transform"
              style={{ transformOrigin: "center center" }}
            >
              <ShowcaseCard item={item} active={i === active} />
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex items-center justify-center gap-2.5" role="tablist" aria-label="Carousel progress">
        {showcase.map((item, i) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to ${item.title}`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === active
                ? "w-7 bg-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                : "w-2 bg-white/20 hover:bg-white/45"
            )}
          />
        ))}
      </div>
    </section>
  );
}
