import type { Metadata } from "next";
import { PageStub } from "@/components/shared/page-stub";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <PageStub
      title="Portfolio"
      description="Your confidential balances across every wrapper, decryptable on demand, plus pending and historical unwrap requests."
      phase="Phase 4"
    />
  );
}
