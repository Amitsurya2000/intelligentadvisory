"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { team, type TeamMember } from "@/lib/data";
import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const accent: Record<TeamMember["accent"], { grad: string; text: string; glow: string }> = {
  cyan: {
    grad: "from-brand-cyan to-cyan-600",
    text: "text-brand-cyan",
    glow: "shadow-[0_0_30px_-6px_rgba(34,211,238,0.5)]",
  },
  violet: {
    grad: "from-brand-violet to-indigo-600",
    text: "text-brand-violet",
    glow: "shadow-[0_0_30px_-6px_rgba(139,92,246,0.5)]",
  },
  fuchsia: {
    grad: "from-brand-fuchsia to-rose-600",
    text: "text-brand-fuchsia",
    glow: "shadow-[0_0_30px_-6px_rgba(217,70,239,0.5)]",
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Gradient-ring avatar that shows a real photo when present, else the initial. */
function Avatar({ m }: { m: TeamMember }) {
  const a = accent[m.accent];
  const [errored, setErrored] = useState(false);
  const showPhoto = Boolean(m.photo) && !errored;

  return (
    <div className={cn("relative mx-auto size-24 rounded-full bg-gradient-to-br p-[3px]", a.grad, a.glow)}>
      <div className="size-full overflow-hidden rounded-full bg-brand-ink ring-2 ring-brand-ink">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            onError={() => setErrored(true)}
            className="size-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "grid size-full place-items-center bg-gradient-to-br font-display text-3xl font-bold text-white",
              a.grad
            )}
          >
            {m.initial}
          </div>
        )}
      </div>
    </div>
  );
}

export function Team() {
  return (
    <section id="team" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The squad"
          title={
            <>
              Meet the <span className="gradient-text">Intelligent Team</span>
            </>
          }
          description="Growth-obsessed marketers, AI engineers, and funnel architects working together to scale your brand."
        />

        <RevealGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {team.map((m) => (
            <motion.div key={m.name} variants={cardVariants}>
              <div className="group h-full rounded-2xl border border-white/[0.07] glass p-6 transition-colors hover:border-white/15">
                <Avatar m={m} />

                <div className="mt-5 text-center">
                  <h3 className="font-display text-lg font-semibold text-foreground">{m.name}</h3>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium uppercase tracking-wider",
                      accent[m.accent].text
                    )}
                  >
                    {m.role}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {m.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                  {m.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
