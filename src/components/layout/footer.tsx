import { Sparkles, Linkedin, Youtube, Twitter, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

const socials = [
  { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: Twitter, href: siteConfig.social.x, label: "X" },
  { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Media Buying", href: "#services" },
      { label: "Funnel Building", href: "#services" },
      { label: "AI Agents", href: "#services" },
      { label: "CRM AI", href: "#services" },
      { label: "API Integration", href: "#services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#founder" },
      { label: "Results", href: "#metrics" },
      { label: "Team", href: "#team" },
      { label: "Contact", href: `mailto:${siteConfig.email}` },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-brand-ink">
              <Sparkles className="size-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold">
              Intelligent<span className="gradient-text"> Advisory</span>
            </span>
          </a>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm text-brand-cyan transition-colors hover:text-brand-cyan/80"
          >
            {siteConfig.email}
          </a>
          <div className="mt-2 flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/80">
              {col.heading}
            </h3>
            {col.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground md:flex-row">
        <p>© Intelligent Advisory. All rights reserved.</p>
        <ul className="flex items-center gap-5">
          <li><a href="#" className="transition-colors hover:text-brand-cyan">Privacy</a></li>
          <li><a href="#" className="transition-colors hover:text-brand-cyan">Terms</a></li>
          <li><a href="#" className="transition-colors hover:text-brand-cyan">Refund</a></li>
        </ul>
      </div>
    </footer>
  );
}
