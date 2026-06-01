import { pressLogos, type PressFont } from "@/lib/data";
import { cn } from "@/lib/utils";

const fontClass: Record<PressFont, string> = {
  serif: "font-serif",
  display: "font-display",
  mono: "font-mono",
};

/**
 * "As Featured In" press credibility strip — an infinite, hover-pausable
 * marquee of publication wordmarks. Grayscale at rest, brightens on hover.
 * Swap the text wordmarks in data.ts for real SVG logos when available.
 */
export function PressLogos() {
  // Duplicate so the -50% marquee loops seamlessly.
  const row = [...pressLogos, ...pressLogos];

  return (
    <section
      aria-label="As featured in"
      className="relative border-y border-white/[0.06] bg-white/[0.015] py-10"
    >
      <p className="mb-7 text-center font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">
        As featured in
      </p>

      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused] sm:gap-20">
          {row.map((p, i) => (
            <span
              key={`${p.name}-${i}`}
              aria-hidden={i >= pressLogos.length}
              className={cn(
                "select-none whitespace-nowrap text-2xl font-bold text-white/35 transition-colors duration-300 hover:text-white/80 sm:text-3xl",
                fontClass[p.font],
                p.className
              )}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
