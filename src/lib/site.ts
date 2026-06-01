/**
 * Global site configuration — brand identity, nav, and the single CTA target.
 * Update the Calendly / booking URL in ONE place here.
 */
export const siteConfig = {
  name: "Intelligent Advisory",
  shortName: "IA",
  domain: "intelligentadvisory.in",
  url: "https://intelligentadvisory.in",
  tagline: "Growth-Obsessed AI Agency",
  description:
    "We engineer intelligent growth systems for ambitious brands. Media Buying + AI + Funnels = Unstoppable Growth.",
  // Primary conversion target. Swap for the real Calendly/Cal.com link.
  bookingUrl: "https://cal.com/intelligent-advisory/strategy-call",
  demoUrl: "#process",
  email: "rajan@intelligentadvisory.in",
  social: {
    x: "https://x.com/intelligentadv",
    linkedin: "https://www.linkedin.com/company/intelligent-advisory",
    youtube: "https://youtube.com/@intelligentadvisory",
  },
} as const;

export const navLinks = [
  { label: "Solutions", href: "#services" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Live Demo", href: "#live-demo" },
  { label: "About", href: "#founder" },
] as const;
