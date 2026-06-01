"use client";

import { ArrowRight, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Magnetic } from "@/components/shared/magnetic-button";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/data";

const industries = ["E-commerce", "SaaS", "High-Ticket Services", "Ad Tech"];

export function FinalCTA() {
  return (
    <section id="cta" className="section relative overflow-hidden">
      {/* Dramatic backdrop: grid + radial brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gradient opacity-20 blur-[140px]"
      />
      {/* Floating orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[18%] -z-10 h-40 w-40 rounded-full bg-brand-cyan/20 blur-3xl animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] bottom-[14%] -z-10 h-52 w-52 rounded-full bg-brand-fuchsia/20 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[22%] top-[12%] -z-10 h-24 w-24 rounded-full bg-brand-violet/25 blur-2xl animate-float"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          {/* Glowing animated gradient border wrapping a glass-strong panel */}
          <div className="gradient-border glow-violet rounded-[2rem]">
            <div className="glass-strong relative overflow-hidden rounded-[calc(2rem-1px)] bg-card px-6 py-14 sm:px-12 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-brand-violet/70 to-transparent"
              />

              <div className="relative mx-auto max-w-3xl text-center">
                <span className="eyebrow mx-auto mb-6 inline-flex items-center gap-2">
                  <Sparkles className="size-3.5 text-brand-cyan" />
                  Your Move
                </span>

                <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                  Let&apos;s Build Your{" "}
                  <span className="gradient-text-animated">Revenue Machine</span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
                  Every day without a system is revenue left on the table. Book a free strategy
                  call and we&apos;ll map exactly how to scale your brand — no fluff, no obligation,
                  no hard sell.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Magnetic>
                    <Button asChild size="lg" className="group w-full sm:w-auto">
                      <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                        Scale My Brand Now
                        <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </Magnetic>

                  <Button asChild size="lg" variant="ghost" className="group w-full sm:w-auto">
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="mr-2 size-4 text-muted-foreground transition-colors group-hover:text-brand-cyan" />
                      Email the team
                    </a>
                  </Button>
                </div>

                {/* Trust line + industries */}
                <p className="mt-12 text-sm text-muted-foreground">
                  Trusted by <span className="font-semibold text-foreground">500+ businesses</span>{" "}
                  across India
                </p>
                <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                  {industries.map((ind, i) => (
                    <li key={ind} className="flex items-center gap-3">
                      <span>{ind}</span>
                      {i < industries.length - 1 && (
                        <span className="size-1 rounded-full bg-brand-cyan/60" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Compact FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <SectionHeading
            eyebrow="Before you book"
            title={
              <>
                Questions, <span className="gradient-text">answered</span>
              </>
            }
            description="Everything teams ask before deploying their first AI employee."
            align="center"
          />

          <Reveal delay={0.1} className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`}>
                  <AccordionTrigger>
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-xs text-brand-cyan">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pl-7 leading-relaxed">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>

        {/* Reassurance microcopy */}
        <Reveal delay={0.15}>
          <p className="mt-12 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            No commitment <span className="text-brand-violet">·</span> 30-minute call{" "}
            <span className="text-brand-fuchsia">·</span> Tailored AI roadmap
          </p>
        </Reveal>
      </div>
    </section>
  );
}
