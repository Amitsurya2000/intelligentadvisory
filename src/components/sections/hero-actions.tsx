"use client";

import { motion } from "framer-motion";
import { Play, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/magnetic-button";

/**
 * Hero call-to-action + social proof, placed AFTER the video so the page flow
 * is: headline → video → CTAs/reviews.
 */
export function HeroActions() {
  return (
    <section className="relative px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Magnetic>
            <Button asChild size="lg">
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                <Sparkles />
                Scale My Brand Now
              </a>
            </Button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Button asChild size="lg" variant="secondary">
              <a href={siteConfig.demoUrl}>
                <Play />
                See How It Works
              </a>
            </Button>
          </Magnetic>
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <ul className="flex -space-x-3" aria-hidden="true">
            {["AI", "ML", "NB", "VC", "ML"].map((m, i) => (
              <li
                key={i}
                className={cn(
                  "grid size-9 place-items-center rounded-full border border-white/20 font-mono text-xs font-semibold text-brand-ink ring-2 ring-brand-ink",
                  i % 3 === 0 && "bg-brand-cyan",
                  i % 3 === 1 && "bg-brand-violet",
                  i % 3 === 2 && "bg-brand-fuchsia"
                )}
              >
                {m}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1" aria-label="Rated 5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-brand-cyan text-brand-cyan" />
              ))}
            </span>
            <span className="text-sm text-zinc-300">
              <span className="font-semibold text-white">4.8/5</span> from 7,554 reviews · 500+
              brands scaled
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
