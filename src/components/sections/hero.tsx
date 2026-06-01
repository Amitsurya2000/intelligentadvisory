"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Hero background video. Plays public/hero-workforce.mp4 full-bleed. If the    */
/*  file is missing it stays hidden (onError) and the CSS gradient shows.        */
/* -------------------------------------------------------------------------- */

function HeroWorkforceVideo({ onReady }: { onReady?: () => void }) {
  const [ready, setReady] = useState(false);
  return (
    <video
      src="/hero-workforce.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => {
        setReady(true);
        onReady?.();
      }}
      onError={() => setReady(false)}
      className={cn(
        "absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0"
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Headline word-stagger reveal                                               */
/* -------------------------------------------------------------------------- */

type TWPhase = "typing" | "holding" | "deleting";

function Cursor() {
  return (
    <span className="ml-1 inline-block h-[0.78em] w-[0.07em] translate-y-[0.05em] animate-pulse bg-brand-cyan align-middle" />
  );
}

/* Two-line headline typewriter: line 1 (white) then line 2 (gradient). Holds,
   erases, and loops. The cursor stays on the active line. Skips to full text
   for reduced motion. The paired invisible "ghost" reserves the full height so
   the page never reflows while it types/erases. */
function HeadlineTypewriter({
  line1,
  line2,
  speed = 130,
  hold = 2400,
}: {
  line1: string;
  line2: string;
  speed?: number;
  hold?: number;
}) {
  const total = line1.length + line2.length;
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<TWPhase>("typing");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      t =
        count < total
          ? setTimeout(() => setCount((c) => c + 1), speed)
          : setTimeout(() => setPhase("holding"), hold);
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), 200);
    } else {
      t =
        count > 0
          ? setTimeout(() => setCount((c) => c - 1), speed / 1.6)
          : setTimeout(() => setPhase("typing"), 600);
    }
    return () => clearTimeout(t);
  }, [count, phase, total, speed, hold]);

  const c1 = Math.min(count, line1.length);
  const c2 = Math.max(0, Math.min(count - line1.length, line2.length));
  const onLine2 = count > line1.length;

  return (
    <span aria-hidden="true">
      <span className="block">
        {line1.slice(0, c1)}
        {!onLine2 && <Cursor />}
      </span>
      <span className="gradient-text-animated block">
        {line2.slice(0, c2)}
        {onLine2 && <Cursor />}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Section — King-Kong-style: real footage behind bold copy             */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-brand-ink"
    >
      {/* CSS fallback — painted before/without the video so it never looks empty */}
      <div className="absolute inset-0 -z-30 bg-brand-ink" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-30"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, rgba(139,92,246,0.22), transparent 70%), radial-gradient(50% 50% at 20% 80%, rgba(34,211,238,0.16), transparent 70%)",
        }}
      />

      {/* Hero background video — the only hero animation */}
      <HeroWorkforceVideo />

      {/* Darken the footage so the headline dominates (animation stays subtle) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-ink/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_65%_at_50%_50%,rgba(5,6,12,0.55),transparent_80%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink via-brand-ink/35 to-brand-ink/70"
      />
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-15" aria-hidden="true" />

      {/* ------------------------------- Content ------------------------------- */}
      <div className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="eyebrow"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-cyan opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-cyan" />
            </span>
            Growth-Obsessed AI Agency
          </motion.span>

          <h1 className="relative mt-6 font-impact text-[2.7rem] uppercase leading-[0.95] tracking-tight text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem]">
            <span className="sr-only">We Turn Ad Spend Into Revenue Machines</span>
            {/* Ghost reserves the full TWO-line height so nothing reflows */}
            <span aria-hidden="true" className="invisible block">
              <span className="block">We Turn Ad Spend Into</span>
              <span className="block">Revenue Machines</span>
            </span>
            {/* Animated two-line headline overlaid on the reserved space */}
            <span className="absolute inset-0 block">
              <HeadlineTypewriter
                line1="We Turn Ad Spend Into"
                line2="Revenue Machines"
                speed={155}
                hold={2600}
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            You&apos;re spending more on marketing and getting less back. We install elite media
            buying, high-converting funnels, and 24/7 AI agents into one system — so growth stops
            being a gamble and finally becomes predictable.
          </motion.p>

          {/* CTAs + reviews now live in <HeroActions /> — placed after the video */}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href={siteConfig.demoUrl}
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-400 transition-colors hover:text-white sm:flex"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
        <span className="grid h-9 w-6 place-items-start rounded-full border border-white/20 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-brand-cyan"
          />
        </span>
        <ArrowDown className="size-3" />
      </motion.a>
    </section>
  );
}
