import { HeroSection } from "@/components/blocks/hero-section-5";
import { Problem } from "@/components/landing/problem";
import { StatsBand } from "@/components/landing/stats-band";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DevTeaser } from "@/components/landing/dev-teaser";
import { TrustSecurity } from "@/components/landing/trust-security";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <Problem />
      <StatsBand />
      <HowItWorks />
      <DevTeaser />
      <TrustSecurity />
    </>
  );
}
