"use client";

import { funnelStages } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * The Intelligent Funnel — a futuristic six-stage pipeline with a glowing neon
 * spine, alternating glass nodes, and scroll-reveal.
 */
export function IntelligentFunnel() {
  return (
    <section id="funnel" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[60%] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="The method"
          title={
            <>
              The <span className="gradient-text-animated">Intelligent Funnel</span>
            </>
          }
          description="A systematic, six-stage approach to building unstoppable business momentum."
        />

        <div className="relative mt-16">
          {/* Neon spine (desktop) */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-cyan/40 to-transparent lg:block"
          />

          <ul className="space-y-8 lg:space-y-14">
            {funnelStages.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={s.n}
                  className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
                >
                  {/* Connector node */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 hidden size-4 -translate-x-1/2 rounded-full bg-brand-cyan shadow-[0_0_24px_rgba(34,211,238,0.9)] ring-4 ring-brand-cyan/15 lg:block"
                  />

                  {/* Copy */}
                  <Reveal
                    direction={left ? "right" : "left"}
                    className={cn(
                      left ? "lg:order-1 lg:pr-12 lg:text-right" : "lg:order-2 lg:pl-12"
                    )}
                  >
                    <div className="font-mono text-xs tracking-[0.3em] text-brand-cyan/80">
                      STAGE {s.n}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">{s.label}</h3>
                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </Reveal>

                  {/* Glass node card */}
                  <Reveal
                    className={cn(left ? "lg:order-2 lg:pl-12" : "lg:order-1 lg:pr-12")}
                  >
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-5xl font-bold text-white/[0.06]">
                          {s.n}
                        </span>
                        <span className="grid size-12 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 font-display font-bold text-brand-cyan">
                          {i + 1}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {s.label} layer
                        </span>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
