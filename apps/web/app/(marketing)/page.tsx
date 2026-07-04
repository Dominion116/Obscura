import { HeroSection } from "@/components/blocks/hero-section-5";
import { StatsBento } from "@/components/blocks/stats-bento";
import { Feature17 } from "@/components/blocks/feature17";
import { DevTeaser } from "@/components/landing/dev-teaser";
import { TrustSecurity } from "@/components/landing/trust-security";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBento />
      <Feature17 />
      <DevTeaser />
      <TrustSecurity />
    </>
  );
}
