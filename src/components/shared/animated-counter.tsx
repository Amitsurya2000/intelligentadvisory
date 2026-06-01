"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to render (e.g. 1 for "1.2"). */
  decimals?: number;
  /** Count-up duration in seconds. */
  duration?: number;
  className?: string;
}

/** Counts visibly from 0 → value (fast easeOut) the first time it scrolls into view. */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start: number | undefined;
    const ms = duration * 1000;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (start === undefined) start = now;
      const t = Math.min((now - start) / ms, 1);
      setDisplay(value * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = (() => {
    if (decimals > 0) return display.toFixed(decimals);
    const n = Math.round(display);
    return Math.abs(n) >= 1000 ? new Intl.NumberFormat("en-US").format(n) : String(n);
  })();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
