import { HeroSection } from "@/components/sections/hero";
import { VideoReveal } from "@/components/sections/video-reveal";
import { PressLogos } from "@/components/sections/press-logos";
import { TrustMetrics } from "@/components/sections/trust-metrics";
import { BusinessProblems } from "@/components/sections/business-problems";
import { AIEcosystem } from "@/components/sections/ai-ecosystem";
import { IntelligentFunnel } from "@/components/sections/intelligent-funnel";
import { ServicesSection } from "@/components/sections/services";
import { CaseStudies } from "@/components/sections/case-studies";
import { Showcase } from "@/components/sections/showcase";
import { LiveDemo } from "@/components/sections/live-demo";
import { ClientLogos } from "@/components/sections/client-logos";
import { Testimonials } from "@/components/sections/testimonials";
import { Team } from "@/components/sections/team";
import { FounderStory } from "@/components/sections/founder-story";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <HeroSection />
      <VideoReveal />
      <PressLogos />
      <TrustMetrics />
      <BusinessProblems />
      <AIEcosystem />
      <IntelligentFunnel />
      <ServicesSection />
      <CaseStudies />
      <Showcase />
      <LiveDemo />
      <ClientLogos />
      <Testimonials />
      <Team />
      <FounderStory />
      <FinalCTA />
    </>
  );
}
