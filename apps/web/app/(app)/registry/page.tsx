import type { Metadata } from "next";
import { PageStub } from "@/components/shared/page-stub";

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  return (
    <PageStub
      title="Registry explorer"
      description="Every ERC-20 to ERC-7984 wrapper pair on Sepolia with validity status, search, conversion rate, decimals, and Total Value Shielded."
      phase="Phase 1"
    />
  );
}
