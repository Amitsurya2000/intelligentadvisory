"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  MessageSquare,
  UserCheck,
  FileSearch,
  Send,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FileText,
  ScanLine,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import {
  demoTabs,
  chatSeed,
  chatReplies,
  docInsights,
  type DemoTabId,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Magnetic } from "@/components/shared/magnetic-button";

/* ------------------------------------------------------------------ */
/* Icon registry — lucide names from data resolved to components      */
/* ------------------------------------------------------------------ */
const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  UserCheck,
  FileSearch,
};

type Accent = "cyan" | "violet" | "fuchsia";
const accentText: Record<Accent, string> = {
  cyan: "text-brand-cyan",
  violet: "text-brand-violet",
  fuchsia: "text-brand-fuchsia",
};
const accentRing: Record<Accent, string> = {
  cyan: "shadow-[0_0_0_1px_rgba(34,211,238,0.4)]",
  violet: "shadow-[0_0_0_1px_rgba(139,92,246,0.4)]",
  fuchsia: "shadow-[0_0_0_1px_rgba(217,70,239,0.4)]",
};
const tabAccent: Record<DemoTabId, Accent> = {
  chat: "cyan",
  lead: "violet",
  doc: "fuchsia",
};

/* ------------------------------------------------------------------ */
/* TAB 1 — Chat assistant                                             */
/* ------------------------------------------------------------------ */
interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

function pickReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("cost") || q.includes("save") || q.includes("price"))
    return chatReplies.cost;
  if (q.includes("support") || q.includes("ticket"))
    return chatReplies.support;
  if (q.includes("lead") || q.includes("qualif"))
    return chatReplies.leads;
  return chatReplies.default;
}

const suggestions = [
  "How much can I save?",
  "Automate support",
  "Qualify my leads",
];

function ChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    chatSeed.map((m) => ({ role: "assistant", text: m.text }))
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: pickReply(text) },
      ]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="flex h-[460px] flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-1 py-2 [scrollbar-width:thin]"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={cn(
                "flex items-end gap-2.5",
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full",
                  m.role === "user"
                    ? "bg-white/10 text-foreground"
                    : "bg-brand-gradient text-brand-ink"
                )}
              >
                {m.role === "user" ? (
                  <User className="size-4" />
                ) : (
                  <Bot className="size-4" />
                )}
              </span>
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-br-md bg-white/[0.08] text-foreground"
                    : "rounded-bl-md glass text-foreground/90"
                )}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-brand-ink">
                <Bot className="size-4" />
              </span>
              <div className="glass flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-brand-cyan"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: d * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand-cyan/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about cost, support, or leads…"
          aria-label="Message the AI assistant"
          className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-cyan/50"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!input.trim() || typing}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TAB 2 — Lead qualification agent                                   */
/* ------------------------------------------------------------------ */
const leadSteps = [
  "Enriching company profile…",
  "Scoring intent signals…",
  "Mapping automation opportunities…",
  "Calculating projected ROI…",
];
const bottlenecks = [
  "Slow customer support",
  "Manual operations & data entry",
  "Leads going cold",
  "High operating costs",
];

type LeadPhase = "form" | "analyzing" | "result";

function LeadDemo() {
  const [phase, setPhase] = useState<LeadPhase>("form");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [monthlyLeads, setMonthlyLeads] = useState("");
  const [bottleneck, setBottleneck] = useState(bottlenecks[0]);
  const [step, setStep] = useState(0);

  // Deterministic score derived from inputs.
  const leadsNum = Math.max(0, parseInt(monthlyLeads || "0", 10) || 0);
  const score = Math.min(98, 72 + Math.round(Math.min(leadsNum, 600) / 25));
  const recommended =
    bottleneck === bottlenecks[0]
      ? "AI Support Agent"
      : bottleneck === bottlenecks[1]
        ? "Business Automation Suite"
        : bottleneck === bottlenecks[2]
          ? "Lead Qualification Agent"
          : "Agentic Cost-Reduction System";

  useEffect(() => {
    if (phase !== "analyzing") return;
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= leadSteps.length - 1) {
          clearInterval(id);
          setTimeout(() => setPhase("result"), 600);
          return s;
        }
        return s + 1;
      });
    }, 750);
    return () => clearInterval(id);
  }, [phase]);

  const reset = () => {
    setPhase("form");
    setStep(0);
  };

  return (
    <div className="min-h-[460px]">
      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => {
              e.preventDefault();
              setPhase("analyzing");
            }}
            className="grid gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={fieldClass}
                />
              </Field>
              <Field label="Company">
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className={fieldClass}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Monthly leads">
                <input
                  required
                  inputMode="numeric"
                  value={monthlyLeads}
                  onChange={(e) =>
                    setMonthlyLeads(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="500"
                  className={fieldClass}
                />
              </Field>
              <Field label="Biggest bottleneck">
                <select
                  value={bottleneck}
                  onChange={(e) => setBottleneck(e.target.value)}
                  className={cn(fieldClass, "appearance-none")}
                >
                  {bottlenecks.map((b) => (
                    <option key={b} value={b} className="bg-brand-ink">
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Magnetic>
              <Button type="submit" className="mt-2 w-full" size="lg">
                <Sparkles className="size-4" />
                Run instant qualification
              </Button>
            </Magnetic>
            <p className="text-center font-mono text-xs text-muted-foreground">
              Deterministic demo — no data leaves your browser.
            </p>
          </motion.form>
        )}

        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[400px] flex-col justify-center gap-5"
          >
            <div className="flex items-center gap-3 font-display text-lg font-semibold">
              <Loader2 className="size-5 animate-spin text-brand-violet" />
              Analyzing {company || "your business"}…
            </div>
            <div className="space-y-3">
              {leadSteps.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                        done
                          ? "border-brand-violet bg-brand-violet/20 text-brand-violet"
                          : active
                            ? "border-brand-violet/60 text-brand-violet"
                            : "border-white/10 text-muted-foreground"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="size-4" />
                      ) : active ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        done || active
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((step + 1) / leadSteps.length) * 100}%`,
                }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="flex min-h-[400px] flex-col gap-5"
          >
            <div className="flex items-center justify-between gap-4">
              <Badge variant="violet">
                <CheckCircle2 className="size-3.5" /> Qualified
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {company || "Acme Inc."}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <ScoreRing score={score} />
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Fit score
                </p>
                <p className="font-display text-2xl font-bold">
                  Strong match{name ? `, ${name.split(" ")[0]}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  High-impact automation opportunity detected.
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <ResultRow label="Recommended solution" value={recommended} />
              <ResultRow
                label="Est. monthly hours saved"
                value={`${(Math.max(leadsNum, 120) * 0.4).toFixed(0)} hrs`}
              />
              <ResultRow label="Projected ROI" value="6–11x in 90 days" />
            </div>

            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              <Magnetic className="sm:flex-1">
                <Button asChild size="lg" className="w-full">
                  <a href={siteConfig.bookingUrl}>
                    Book strategy call
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </Magnetic>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={reset}
              >
                Run again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-violet/50";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-[76px] shrink-0 place-items-center">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * score) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-display text-lg font-bold">{score}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TAB 3 — Document analyzer                                          */
/* ------------------------------------------------------------------ */
type DocPhase = "idle" | "scanning" | "done";

// Deterministic confidence per field.
const confidences = [99, 98, 96, 94, 88];

function DocDemo() {
  const [phase, setPhase] = useState<DocPhase>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const start = () => {
    if (phase === "scanning") return;
    setPhase("scanning");
    timer.current = setTimeout(() => setPhase("done"), 2400);
  };

  return (
    <div className="grid min-h-[460px] gap-5 md:grid-cols-[1fr_1.1fr]">
      {/* Mock document with scan line */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2 text-brand-fuchsia">
          <FileText className="size-4" />
          <span className="font-mono text-xs">contract_sample.pdf</span>
        </div>
        <div className="space-y-2.5" aria-hidden="true">
          {[
            "w-3/4",
            "w-full",
            "w-5/6",
            "w-2/3",
            "w-full",
            "w-4/5",
            "w-1/2",
            "w-full",
            "w-3/5",
          ].map((w, i) => (
            <div
              key={i}
              className={cn("h-2 rounded-full bg-white/10", w)}
            />
          ))}
        </div>

        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-brand-fuchsia/25 to-transparent"
              initial={{ y: -64 }}
              animate={{ y: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-0 h-px w-full bg-brand-fuchsia shadow-[0_0_12px_2px_rgba(217,70,239,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "idle" && (
          <div className="absolute inset-0 grid place-items-center bg-brand-ink/40 backdrop-blur-[2px]">
            <Magnetic>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={start}
              >
                <ScanLine className="size-4" />
                Upload sample contract
              </Button>
            </Magnetic>
          </div>
        )}
      </div>

      {/* Extracted fields */}
      <div className="flex flex-col">
        <div className="mb-3 flex items-center gap-2">
          <FileSearch className="size-4 text-brand-fuchsia" />
          <span className="font-display text-sm font-semibold">
            Extracted fields
          </span>
          {phase === "scanning" && (
            <Loader2 className="size-3.5 animate-spin text-brand-fuchsia" />
          )}
        </div>

        {phase === "done" ? (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={listVariants}
            className="space-y-3"
          >
            {docInsights.map((field, i) => {
              const isRisk = /risk|flag/i.test(field.label);
              const conf = confidences[i] ?? 95;
              return (
                <motion.li
                  key={field.label}
                  variants={itemVariants}
                  className={cn(
                    "rounded-xl border p-3.5",
                    isRisk
                      ? "border-brand-fuchsia/40 bg-brand-fuchsia/[0.06]"
                      : "border-white/10 bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {isRisk && (
                          <ShieldAlert className="size-3.5 text-brand-fuchsia" />
                        )}
                        {field.label}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-sm font-medium",
                          isRisk ? "text-brand-fuchsia" : "text-foreground"
                        )}
                      >
                        {field.value}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {conf}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        isRisk
                          ? "bg-brand-fuchsia"
                          : "bg-brand-gradient"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${conf}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                    />
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        ) : (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-white/10 text-center text-sm text-muted-foreground">
            <p className="max-w-[16rem] px-4">
              {phase === "scanning"
                ? "Reading clauses and extracting structured data…"
                : "Upload a contract to see fields, confidence scores, and risk flags extracted instantly."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0 },
};

/* ------------------------------------------------------------------ */
/* Section shell + tab switcher                                       */
/* ------------------------------------------------------------------ */
export function LiveDemo() {
  const [active, setActive] = useState<DemoTabId>("chat");
  const accent = tabAccent[active];

  return (
    <section id="live-demo" className="section relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-brand-violet/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-24 bottom-1/4 size-72 rounded-full bg-brand-cyan/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Try it live"
          title={
            <>
              Experience your{" "}
              <span className="gradient-text-animated">AI workforce</span> in
              action
            </>
          }
          description="No sign-up, no backend. Play with three of the agents we deploy — chat, lead qualification, and document intelligence — right here in your browser."
        />

        {/* Tab switcher */}
        <div
          role="tablist"
          aria-label="Live demo selector"
          className="mx-auto mt-12 flex w-full max-w-2xl flex-col gap-2 rounded-2xl glass p-1.5 sm:flex-row"
        >
          {demoTabs.map((tab) => {
            const Icon: LucideIcon =
              (tabIcons[tab.icon] as LucideIcon) ?? MessageSquare;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="demo-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 size-4",
                    isActive && accentText[tabAccent[tab.id]]
                  )}
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="mx-auto mt-6 max-w-4xl">
          <SpotlightCard accent={accent} className={cn("p-5 sm:p-7", accentRing[accent])}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                role="tabpanel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
              >
                {active === "chat" && <ChatDemo />}
                {active === "lead" && <LeadDemo />}
                {active === "doc" && <DocDemo />}
              </motion.div>
            </AnimatePresence>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
