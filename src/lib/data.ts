/**
 * Central content store for Intelligent Advisory.
 * Every section component imports from here so copy stays consistent and editable.
 * Icon fields are lucide-react icon NAMES (string) — resolve them in the component
 * with a local icon map to keep this file free of React imports.
 */

export type LucideName = string;

/* ---------------------------------- Section 2: Trust Metrics --------------------------------- */
export interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: LucideName;
  description: string;
}

export const metrics: Metric[] = [
  {
    label: "Businesses Scaled",
    value: 500,
    suffix: "+",
    icon: "Rocket",
    description: "",
  },
  {
    label: "Revenue Generated",
    value: 50,
    prefix: "₹",
    suffix: "Cr+",
    icon: "Workflow",
    description: "",
  },
  {
    label: "Average Growth",
    value: 10,
    suffix: "X",
    icon: "Clock",
    description: "",
  },
  {
    label: "Growth Trajectories",
    value: 100,
    prefix: "₹",
    suffix: "Cr+",
    icon: "HeartHandshake",
    description: "",
  },
];

/* -------------------------------- Section 3: Business Problems -------------------------------- */
export interface BeforeAfterItem {
  before: { title: string; detail: string; icon: LucideName };
  after: { title: string; detail: string; icon: LucideName };
}

export const beforeAfter: BeforeAfterItem[] = [
  {
    before: {
      title: "Manual Operations",
      detail: "Teams drowning in repetitive copy-paste busywork.",
      icon: "ClipboardList",
    },
    after: {
      title: "AI Agents",
      detail: "Autonomous agents execute the busywork end-to-end.",
      icon: "Bot",
    },
  },
  {
    before: {
      title: "Missed Leads",
      detail: "Inbound interest goes cold before anyone replies.",
      icon: "UserX",
    },
    after: {
      title: "Automated Workflows",
      detail: "Every lead qualified and routed in seconds, 24/7.",
      icon: "Workflow",
    },
  },
  {
    before: {
      title: "Slow Support",
      detail: "Customers wait hours in a growing ticket backlog.",
      icon: "Hourglass",
    },
    after: {
      title: "Instant Support",
      detail: "AI resolves 80% of tickets the moment they arrive.",
      icon: "Zap",
    },
  },
  {
    before: {
      title: "High Costs",
      detail: "Headcount scales linearly with every new customer.",
      icon: "TrendingUp",
    },
    after: {
      title: "Reduced Costs",
      detail: "Scale output without scaling your payroll.",
      icon: "TrendingDown",
    },
  },
];

/* --------------------------------- Section 4: AI Ecosystem ----------------------------------- */
export interface EcosystemNode {
  id: string;
  label: string;
  icon: LucideName;
  description: string;
}

export const ecosystemCore = {
  label: "AI Agent Core",
  icon: "BrainCircuit",
  description: "An orchestration brain that reasons, plans, and delegates across your stack.",
};

export const ecosystemNodes: EcosystemNode[] = [
  { id: "leadgen", label: "Lead Generation", icon: "Magnet", description: "Find, enrich, and engage your best-fit prospects automatically." },
  { id: "crm", label: "CRM", icon: "Database", description: "Sync, update, and act on customer records in real time." },
  { id: "support", label: "Customer Support", icon: "Headset", description: "Resolve tickets instantly with on-brand, accurate answers." },
  { id: "analytics", label: "Analytics", icon: "LineChart", description: "Turn raw events into decisions and forecasts." },
  { id: "operations", label: "Operations", icon: "Settings2", description: "Automate the back-office workflows that slow you down." },
  { id: "marketing", label: "Marketing Automation", icon: "Megaphone", description: "Launch, personalize, and optimize campaigns on autopilot." },
];

/* ----------------------------------- Section 5: Services ------------------------------------- */
export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideName;
  features: string[];
  accent: "cyan" | "violet" | "fuchsia";
}

export const services: Service[] = [
  {
    slug: "media-buying",
    title: "Media Buying Mastery",
    tagline: "₹20Cr+ Ad Spend Managed",
    description:
      "Sick of ad budgets that vanish with nothing to show? We've managed ₹20Cr+ across Meta, Google, TikTok & YouTube — turning cold clicks into paying customers at ROAS that actually moves the needle.",
    icon: "Target",
    features: [],
    accent: "cyan",
  },
  {
    slug: "funnels",
    title: "High-Converting Funnels",
    tagline: "3x Avg Conversion Lift",
    description:
      "Traffic means nothing if it doesn't convert. We engineer landing pages, email sequences, and funnels that turn cold strangers into high-ticket buyers — and triple your conversions doing it.",
    icon: "Filter",
    features: [],
    accent: "violet",
  },
  {
    slug: "ai-agents",
    title: "AI Agent Deployment",
    tagline: "80% Tasks Automated",
    description:
      "Stop drowning in repetitive work. We deploy AI agents that answer, qualify, and book calls 24/7 — automating up to 80% of the busywork stealing your time, even while you sleep.",
    icon: "Bot",
    features: [],
    accent: "fuchsia",
  },
  {
    slug: "crm-ai",
    title: "CRM + AI Integration",
    tagline: "5x Lead Conversion",
    description:
      "Your leads are going cold in a messy CRM. We wire in AI that nurtures, segments, and follows up automatically — so no lead slips through the cracks and more of them turn into revenue.",
    icon: "Database",
    features: [],
    accent: "cyan",
  },
  {
    slug: "automation",
    title: "API & Automation Systems",
    tagline: "100+ Integrations",
    description:
      "Your tools don't talk to each other, and it's quietly costing you sales. We connect everything with powerful integrations and automations — infrastructure that scales without adding headcount.",
    icon: "Workflow",
    features: [],
    accent: "violet",
  },
  {
    slug: "brand-scaling",
    title: "Brand Scaling Strategy",
    tagline: "10x Revenue Growth",
    description:
      "Plateaued at your current level? We hand you the exact roadmap — and execute it with you — to break through 6, 7, and 8 figures with data-driven growth, not guesswork.",
    icon: "Rocket",
    features: [],
    accent: "fuchsia",
  },
];

/* --------------------------------- The Intelligent Funnel ------------------------------------ */
export interface FunnelStage {
  n: string;
  label: string;
  body: string;
}

export const funnelStages: FunnelStage[] = [
  { n: "01", label: "Presence", body: "Establish your digital footprint with authority and precision." },
  { n: "02", label: "Positioning", body: "Strategic market positioning that sets you apart from competition." },
  { n: "03", label: "Authority", body: "Build unshakeable credibility within your industry." },
  { n: "04", label: "Content", body: "High-impact content that converts and compounds over time." },
  { n: "05", label: "Systems", body: "Automated workflows that scale without friction or founder dependency." },
  { n: "06", label: "Scale", body: "Exponential growth through intelligent, data-driven optimization." },
];

/* --------------------------------- Section 6: Case Studies ----------------------------------- */
export interface CaseStudyMetric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}
export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  logo: string; // short monogram
  challenge: string;
  solution: string;
  results: string;
  roi: string;
  metrics: CaseStudyMetric[];
  accent: "cyan" | "violet" | "fuchsia";
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ecom-scale",
    client: "Aurelia Skincare",
    industry: "E-commerce",
    logo: "AS",
    challenge:
      "A D2C skincare brand was stuck at ₹2Cr a year — ad costs climbing, a leaking funnel, and growth that stalled whenever the founder stepped back.",
    solution:
      "We rebuilt the funnel end-to-end and scaled paid media across Meta & Google at 8.4× ROAS with a daily creative-testing engine.",
    results:
      "Revenue scaled from ₹2Cr to ₹19Cr in 18 months — an 847% jump — with acquisition that now compounds on autopilot.",
    roi: "847% in 18 months",
    metrics: [
      { label: "Revenue growth", value: 847, suffix: "%" },
      { label: "Blended ROAS", value: 8.4, suffix: "×" },
      { label: "Timeframe", value: 18, suffix: "mo" },
    ],
    accent: "cyan",
  },
  {
    slug: "saas-scale",
    client: "Quantix SaaS",
    industry: "SaaS",
    logo: "QX",
    challenge:
      "Strong product, flat growth. Inbound leads went unqualified for days while CAC climbed and the team chased low-intent signups.",
    solution:
      "We deployed AI lead scoring and an authority funnel, then re-architected paid acquisition around the highest-intent segments.",
    results:
      "12× ARR growth in 24 months, with ROAS lifting from 2.1× to 7.8× and qualified pipeline more than doubling in one quarter.",
    roi: "12× in 24 months",
    metrics: [
      { label: "ARR growth", value: 12, suffix: "×" },
      { label: "ROAS", value: 7.8, suffix: "×" },
      { label: "Timeframe", value: 24, suffix: "mo" },
    ],
    accent: "violet",
  },
  {
    slug: "high-ticket",
    client: "Apex Coaching",
    industry: "High-Ticket Services",
    logo: "AC",
    challenge:
      "A high-ticket coaching business had no predictable pipeline — every deal depended on referrals and the founder's personal time.",
    solution:
      "We built an authority-positioning system and deployed AI booking agents that qualify prospects and fill the calendar 24/7.",
    results:
      "₹8Cr generated in 12 months from a standing start, with the founder fully out of day-to-day sales.",
    roi: "₹8Cr in 12 months",
    metrics: [
      { label: "Revenue", value: 8, prefix: "₹", suffix: "Cr" },
      { label: "Timeframe", value: 12, suffix: "mo" },
      { label: "Founder hours saved", value: 30, suffix: "h/wk" },
    ],
    accent: "fuchsia",
  },
];

/* --------------------------------- Section 8: Testimonials ----------------------------------- */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string; // monogram
  quote: string;
  rating: number;
  accent: "cyan" | "violet" | "fuchsia";
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "COO",
    company: "NorthBridge Finance",
    avatar: "SC",
    quote:
      "Intelligent Advisory didn't just automate our support — they redesigned how we operate. It's like we hired 40 people overnight, except they never sleep.",
    rating: 5,
    accent: "cyan",
  },
  {
    name: "Marcus Reed",
    role: "VP of Growth",
    company: "Velocity Commerce",
    avatar: "MR",
    quote:
      "Our speed-to-lead went from a day to two minutes. The AI books meetings while we sleep. Pipeline has never looked like this.",
    rating: 5,
    accent: "violet",
  },
  {
    name: "Priya Nair",
    role: "Head of Operations",
    company: "Meridian Logistics",
    avatar: "PN",
    quote:
      "They understood our messy reality and shipped something that actually works in production. The ROI was undeniable within the first quarter.",
    rating: 5,
    accent: "fuchsia",
  },
  {
    name: "David Okafor",
    role: "Founder & CEO",
    company: "Lumen Health",
    avatar: "DO",
    quote:
      "The most senior AI team we've worked with. Strategy, build, and deployment under one roof — no hand-waving, just results.",
    rating: 5,
    accent: "cyan",
  },
  {
    name: "Elena Rossi",
    role: "CMO",
    company: "Aperture Media",
    avatar: "ER",
    quote:
      "Our marketing runs itself now. Campaigns launch, personalize, and optimize without a human touching them. Game changer.",
    rating: 5,
    accent: "violet",
  },
];

/* ---------------------------------- Section 9: Founder Story ---------------------------------- */
export const founder = {
  name: "Rajan",
  role: "Founder & Fractional CEO",
  avatar: "R",
  photo: "/team/rajan.jpg",
  quote: "He doesn't advise businesses. He installs intelligence into them.",
  mission:
    "Remove founder dependency — so the business runs and scales without the founder doing the repetitive work.",
  vision:
    "Engineer ₹100Cr+ growth trajectories for high-ticket businesses through AI-powered operating systems.",
  story:
    "Rajan is the Founder of Intelligent Advisory and former CEO of Launch at Scale — one of India's fastest-growing ad-tech and launch companies. Over the past decade, he has helped scale 500+ businesses — across ad-tech, e-commerce, and high-ticket services — to ₹50Cr+ in revenue through deep expertise in media buying, 360° marketing, and conversion funnel architecture. Today, Rajan works as a Fractional CEO for high-ticket service businesses, deploying the Intelligent Growth Operating System — a proprietary mix of AI agent automation, battle-tested funnels, and operational SOPs that removes founder dependency and engineers ₹100Cr+ growth trajectories.",
  expertise: [
    "Media buying & 360° marketing",
    "Conversion funnel architecture",
    "AI-agent automation & SOPs",
    "Removes founder dependency",
  ],
  stats: [
    { label: "Businesses scaled", value: "500+" },
    { label: "Revenue driven", value: "₹50Cr+" },
    { label: "Growth engineered", value: "₹100Cr+" },
  ],
};

/* ----------------------------------- Team ------------------------------------ */
export interface TeamMember {
  name: string;
  role: string;
  initial: string;
  accent: "cyan" | "violet" | "fuchsia";
  skills: string[];
  bio: string;
  /** Optional headshot — drop a file at this path in public/ to show a real photo. */
  photo?: string;
}

export const team: TeamMember[] = [
  {
    name: "Rajan",
    role: "Founder & CEO",
    initial: "R",
    accent: "cyan",
    skills: ["Media Buying", "AI Strategy", "Brand Scaling"],
    bio: "The architect behind Intelligent Advisory, scaling brands to 7+ figures through AI-powered marketing systems.",
    photo: "/team/rajan.jpg",
  },
  {
    name: "Piyush",
    role: "Head of Media Buying",
    initial: "P",
    accent: "violet",
    skills: ["Meta Ads", "Google Ads", "TikTok Ads"],
    bio: "Managed ₹20Cr+ in ad spend across Meta, Google & TikTok. Obsessed with ROAS optimization.",
    photo: "/team/piyush.jpg",
  },
  {
    name: "Shivam",
    role: "Funnel & Automation Expert",
    initial: "S",
    accent: "fuchsia",
    skills: ["AI Agents", "Funnels", "Automation"],
    bio: "Builds high-converting funnels and AI automation systems that run your customer journey end-to-end.",
    photo: "/team/shivam.jpg",
  },
  {
    name: "Manas",
    role: "Growth Strategist",
    initial: "M",
    accent: "cyan",
    skills: ["Scaling", "Analytics", "Performance"],
    bio: "Data-driven strategist who identifies growth opportunities and creates scaling roadmaps.",
    photo: "/team/manas.jpg",
  },
];

/* ---------------------------------- Section 7: Live AI Demo ----------------------------------- */
export const demoTabs = [
  { id: "chat", label: "AI Chat Assistant", icon: "MessageSquare" },
  { id: "lead", label: "Lead Qualification Agent", icon: "UserCheck" },
  { id: "doc", label: "Document Analyzer", icon: "FileSearch" },
] as const;
export type DemoTabId = (typeof demoTabs)[number]["id"];

/* Canned, deterministic responses so the demo works with zero backend. */
export const chatSeed = [
  { role: "assistant", text: "Hi! I'm an Intelligent Advisory agent. Ask me what AI could automate in your business." },
];
export const chatReplies: Record<string, string> = {
  default:
    "Great question. Based on what you've described, I'd deploy an agent to handle that workflow end-to-end and route only the exceptions to your team. Want to see how that maps to your stack on a free strategy call?",
  cost: "Most clients see 40–70% cost reduction on the automated workflow within 90 days. The agent pays for itself fast — let's model your numbers on a call.",
  support: "We can resolve ~80% of support tickets instantly with an agent grounded in your knowledge base. Your team handles only the nuanced cases.",
  leads: "I can qualify, enrich, and book every inbound lead in under two minutes, 24/7 — no lead ever goes cold again.",
};

export const docInsights = [
  { label: "Document type", value: "Master Services Agreement" },
  { label: "Parties", value: "Acme Corp ↔ Intelligent Advisory" },
  { label: "Contract value", value: "$240,000 / year" },
  { label: "Auto-renewal", value: "Yes — 60-day notice" },
  { label: "Risk flags", value: "2 clauses need review" },
];

/* ------------------------------------- Trust logos ------------------------------------------- */
export const trustLogos = [
  "NorthBridge",
  "Velocity",
  "Meridian",
  "Lumen Health",
  "Aperture",
  "Quantum Labs",
  "Helix",
  "Vertex",
];

/* ------------------------------------- Press / As Featured In -------------------------------- */
export type PressFont = "serif" | "display" | "mono";
export interface PressLogo {
  name: string;
  font: PressFont;
  /** optional tracking tweak to better mimic a real wordmark */
  className?: string;
}

export const pressLogos: PressLogo[] = [
  { name: "Forbes", font: "serif" },
  { name: "Bloomberg", font: "serif" },
  { name: "TechCrunch", font: "display" },
  { name: "WIRED", font: "display", className: "tracking-[0.12em]" },
  { name: "Entrepreneur", font: "serif" },
  { name: "Inc.", font: "serif" },
  { name: "Fast Company", font: "display" },
  { name: "VentureBeat", font: "display" },
  { name: "Business Insider", font: "serif" },
  { name: "The Verge", font: "display" },
];

/* ------------------------------------- Showcase / Selected work ------------------------------ */
export interface ShowcaseItem {
  title: string;
  category: string;
  result: string;
  accent: "cyan" | "violet" | "fuchsia" | "ink";
}

export const showcase: ShowcaseItem[] = [
  { title: "NorthBridge Finance", category: "Fintech Support AI", result: "6.4× ROI in 90 days", accent: "cyan" },
  { title: "Velocity Commerce", category: "Lead Qualification Agent", result: "2× qualified pipeline", accent: "violet" },
  { title: "Meridian Logistics", category: "Document Intelligence", result: "$1.2M saved / year", accent: "fuchsia" },
  { title: "Lumen Health", category: "Patient Support Automation", result: "80% tickets auto-resolved", accent: "ink" },
  { title: "Aperture Media", category: "Marketing Automation", result: "Campaigns on autopilot", accent: "violet" },
  { title: "Quantum Labs", category: "Custom AI Platform", result: "18× faster operations", accent: "cyan" },
];

/* ------------------------------------- Final CTA / FAQ --------------------------------------- */
export const faqs = [
  {
    q: "How fast can you deploy an AI system?",
    a: "Most first deployments go live in 2–4 weeks. We start with a high-impact, well-scoped workflow, prove ROI, then expand.",
  },
  {
    q: "Do we need a technical team to work with you?",
    a: "No. We handle strategy, build, deployment, and monitoring. Your team just brings the business context.",
  },
  {
    q: "Is our data secure?",
    a: "Yes. We build with enterprise-grade security, your data stays in your environment where required, and we sign DPAs.",
  },
  {
    q: "What does it cost?",
    a: "Engagements are scoped to outcomes and ROI, not hours. Book a free strategy call and we'll model the numbers for your case.",
  },
];
