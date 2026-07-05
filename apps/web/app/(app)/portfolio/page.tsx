import type { Metadata } from "next";
import { PortfolioView } from "@/components/portfolio/portfolio-view";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Confidential balances across every wrapper you hold, decryptable on demand, plus pending and historical unwrap requests.",
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
