import { trustLogos } from "@/lib/data";

/**
 * "Trusted by teams at" — an infinite, hover-pausable client-logo marquee.
 * Lives lower in the page (near the testimonials) so it doesn't stack against
 * the "As Featured In" press strip up top.
 */
export function ClientLogos() {
  // Duplicate so the -50% marquee loops seamlessly.
  const marquee = [...trustLogos, ...trustLogos];

  return (
    <section
      aria-label="Trusted by"
      className="relative border-y border-white/[0.06] bg-white/[0.015] py-12"
    >
      <p className="mb-7 text-center font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Trusted by teams at
      </p>
      <div
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
        aria-label="Companies that trust Intelligent Advisory"
      >
        <div className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused] sm:gap-16">
          {marquee.map((name, i) => (
            <span
              key={`${name}-${i}`}
              aria-hidden={i >= trustLogos.length}
              className="select-none whitespace-nowrap font-display text-lg font-semibold text-muted-foreground/60 transition-colors duration-300 hover:text-foreground sm:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
