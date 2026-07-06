import type { Metadata } from "next";
import { FaucetGrid } from "@/components/faucet/faucet-grid";
import { BlurReveal } from "@/components/shared/blur-reveal";

export const metadata: Metadata = { title: "Faucet" };

export default function FaucetPage() {
  return (
    <div className="flex flex-col gap-6">
      <BlurReveal>
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Faucet</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Mint the official Zama mock ERC-20s on Sepolia for free, then wrap
          them into confidential tokens from the registry. These are the same
          underlying tokens the official cTokenMock wrappers are registered
          against, so anything you mint here works everywhere in the
          ecosystem.
        </p>
      </header>
      </BlurReveal>
      <FaucetGrid />
    </div>
  );
}
