# Intelligent Advisory — Deploy AI Employees That Work 24/7

A world-class, futuristic AI-consultancy marketing site engineered to generate qualified AI consulting leads. Dark, glassmorphic, motion-rich, and 3D-interactive — built on a modern, performance-first stack.

> Design language: OpenAI-level trust · Apple Vision Pro premium · Vercel/Linear clean · AI-first futurism.

---

## Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router, RSC) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS 3.4** + CSS variables design tokens |
| Animation | **Framer Motion 11** + **GSAP 3** (ScrollTrigger) |
| 3D | **React Three Fiber 9** + **drei 10** + **three** |
| UI primitives | **shadcn/ui** conventions (Radix + CVA) |
| Icons | **lucide-react** |

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

---

## Folder Structure

```
intelligent-advisory/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # Root layout: fonts, SEO metadata, JSON-LD, global chrome
│  │  ├─ page.tsx            # Homepage — composes the 10 sections in order
│  │  └─ globals.css         # Design tokens + glass/glow/grid utility classes
│  │
│  ├─ components/
│  │  ├─ ui/                 # shadcn primitives (button, card, badge, accordion)
│  │  ├─ layout/             # navbar, footer (cross-cutting chrome)
│  │  ├─ shared/             # reveal, section-heading, animated-counter,
│  │  │                      #   magnetic-button, spotlight-card, cursor-glow, scroll-progress
│  │  ├─ three/              # particle-field (R3F) + scene-background (client-only wrapper)
│  │  └─ sections/           # the 10 page sections (one file each)
│  │
│  ├─ hooks/
│  │  └─ use-mouse-position.ts
│  │
│  └─ lib/
│     ├─ site.ts             # Brand config, nav, single source of truth for the CTA/booking URL
│     ├─ data.ts             # ALL section content + TypeScript types (edit copy here)
│     └─ utils.ts            # cn(), formatNumber(), lerp(), clamp()
│
├─ legacy-vite/              # Archived previous Vite project (git-ignored)
├─ tailwind.config.ts        # Brand palette, keyframes, animations
├─ next.config.mjs           # transpilePackages: three, package-import optimization
└─ components.json           # shadcn config
```

---

## Page Sections (`src/components/sections/`)

| # | File | Section | Highlight |
| --- | --- | --- | --- |
| 1 | `hero.tsx` | Hero | Interactive 3D AI brain (R3F), holographic glass cards, particle field |
| 2 | `trust-metrics.tsx` | Trust Metrics | Scroll-triggered animated counters + logo marquee |
| 3 | `business-problems.tsx` | Before vs After | Interactive comparison of manual → autonomous |
| 4 | `ai-ecosystem.tsx` | AI Ecosystem | Hub-and-spoke graph with animated data flow |
| 5 | `services.tsx` | Services | 6 premium spotlight cards |
| 6 | `case-studies.tsx` | Case Studies | Challenge/Solution/Results/ROI with live data viz |
| 7 | `live-demo.tsx` | Live AI Demo | Chat assistant, lead-qualifier, document analyzer (client-side) |
| 8 | `testimonials.tsx` | Testimonials | Video-style cards + auto-rotating spotlight |
| 9 | `founder-story.tsx` | Founder Story | Mission, vision, expertise |
| 10 | `final-cta.tsx` | Final CTA | Glowing conversion panel + FAQ accordion |

---

## Design System

**Tokens** live as CSS variables in `globals.css` and are mapped to Tailwind in `tailwind.config.ts`.

- **Palette:** electric cyan `#22d3ee` → violet `#8b5cf6` → fuchsia `#d946ef` on deep-space ink `#05060c`.
- **Utility classes:** `.glass` / `.glass-strong`, `.gradient-text`, `.gradient-border`, `.glow-cyan` / `.glow-violet`, `.bg-grid`, `.eyebrow`, `.section`.
- **Animations:** `animate-float`, `animate-pulse-glow`, `animate-gradient-pan`, `animate-marquee`, `animate-border-flow`.
- **Shared motion components:** `<Reveal>` / `<RevealGroup>` (scroll reveals), `<AnimatedCounter>`, `<Magnetic>`, `<SpotlightCard>`.

### Editing content
All copy and figures live in **`src/lib/data.ts`**. The booking/Calendly URL and brand details live in **`src/lib/site.ts`** (`siteConfig.bookingUrl`). Change them in one place.

---

## Performance & Accessibility

- **Client-only 3D:** the Three.js canvas loads via `next/dynamic({ ssr: false })` and fades in after mount — never blocks first paint or SSR.
- **Reduced motion:** `prefers-reduced-motion` is globally respected in `globals.css`; the cursor glow disables on coarse pointers.
- **SEO:** rich `metadata`, Open Graph/Twitter cards, and Organization JSON-LD in `layout.tsx`.
- **Fonts:** `next/font` self-hosts Inter, Space Grotesk, and JetBrains Mono with `display: swap`.
- `optimizePackageImports` trims `lucide-react` and `framer-motion` bundles.

---

## Notes

- The previous Vite/React project was archived to `legacy-vite/` (git-ignored), nothing deleted.
- The live demo is fully client-side and deterministic — wire it to a real API by replacing the canned responses in `data.ts`.
