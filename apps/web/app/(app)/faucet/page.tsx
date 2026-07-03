import type { Metadata } from "next";
import { PageStub } from "@/components/shared/page-stub";

export const metadata: Metadata = { title: "Faucet" };

export default function FaucetPage() {
  return (
    <PageStub
      title="Faucet"
      description="One-click minting of the official cTokenMocks on Sepolia so you always have tokens to wrap."
      phase="Phase 2"
    />
  );
}
