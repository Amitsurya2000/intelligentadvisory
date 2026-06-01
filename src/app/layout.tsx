import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Anton } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/lib/site";
import { SceneBackground } from "@/components/three/scene-background";
import { IntelligenceBackground } from "@/components/three/intelligence-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { CursorGlow } from "@/components/shared/cursor-glow";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI consultancy",
    "AI agents",
    "business automation",
    "agentic AI",
    "AI workflows",
    "generative AI",
    "computer vision",
    "custom AI applications",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: "@intelligentadv",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteConfig.url },
};

export const viewport: Viewport = {
  themeColor: "#05060c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [siteConfig.social.linkedin, siteConfig.social.x, siteConfig.social.youtube],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${anton.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IntelligenceBackground />
        <SceneBackground />
        <CursorGlow />
        <ScrollProgress />
        <Navbar />
        <main id="top" className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
