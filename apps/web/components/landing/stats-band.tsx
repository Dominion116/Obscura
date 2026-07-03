"use client";

// Live stats straight from the registry. Phase 0 reads the pair list on
// chain; Phase 5 switches the data source to the indexer API, which also
// unlocks the aggregate Total Value Shielded figure.

import { useReadContract } from "wagmi";
import {
  registryAbi,
  WRAPPERS_REGISTRY_ADDRESS,
  SEPOLIA_CHAIN_ID,
} from "@obscura/shared";
import { BlurReveal } from "@/components/shared/blur-reveal";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-(--radius-card) px-6 py-8 text-center">
      <p className="text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

export function StatsBand() {
  const { data: pairs, isLoading } = useReadContract({
    abi: registryAbi,
    address: WRAPPERS_REGISTRY_ADDRESS,
    functionName: "getTokenConfidentialTokenPairs",
    chainId: SEPOLIA_CHAIN_ID,
  });

  const total = pairs?.length;
  const valid = pairs?.filter((p) => p.isValid).length;
  const revoked =
    total !== undefined && valid !== undefined ? total - valid : undefined;

  const fmt = (n: number | undefined) =>
    isLoading || n === undefined ? "—" : String(n);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <BlurReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Registered pairs" value={fmt(total)} />
        <Stat label="Valid wrappers" value={fmt(valid)} />
        <Stat label="Revoked wrappers" value={fmt(revoked)} />
        <Stat label="Total Value Shielded" value="—" />
      </BlurReveal>
      <p className="mt-3 text-center text-xs text-muted">
        Read live from the registry on Sepolia
      </p>
    </section>
  );
}
