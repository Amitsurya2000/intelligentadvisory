"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/magnetic-button";
import { siteConfig, navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
          scrolled ? "glass-strong" : "border border-transparent bg-transparent"
        )}
      >
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2.5 pl-2">
          <span className="relative grid size-9 place-items-center rounded-xl bg-brand-gradient text-brand-ink shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)]">
            <Sparkles className="size-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Intelligent<span className="gradient-text"> Advisory</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <Magnetic>
            <Button asChild size="sm" className="h-10">
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book Strategy Call
              </a>
            </Button>
          </Magnetic>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute inset-x-4 top-20 z-50 md:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-3xl p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-2 w-full">
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book Free Strategy Call
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
