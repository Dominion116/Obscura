import { HeroSection } from "@/components/blocks/hero-section-5";
import { StatsBento } from "@/components/blocks/stats-bento";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DevTeaser } from "@/components/landing/dev-teaser";
import { TrustSecurity } from "@/components/landing/trust-security";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBento />
      <HowItWorks />
      <DevTeaser />
      <TrustSecurity />
    </>
  );
}
