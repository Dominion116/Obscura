"use client";

// Global stats for the landing page's live stats band (PRD §6.2, §7.7).
// Primary path reads the indexer's cached aggregate through the API, fast,
// and scales with the registry regardless of size. The on-chain fallback
// (the same aggregation used before the API existed) only activates once
// the API path has actually failed or isn't configured, so the common case
// costs one cheap request instead of two.

import { useQuery } from "@tanstack/react-query";
import type { GlobalStats } from "@obscura/shared";
import { api } from "@/lib/api-client";
import { useRegistryPairs } from "./use-registry";

export type StatsSource = "api" | "chain";

export function useGlobalStats(): {
  data: GlobalStats | undefined;
  isPending: boolean;
  source: StatsSource;
} {
  const apiStats = useQuery({
    queryKey: ["stats", "api"],
    queryFn: () => api.stats(),
    retry: false,
    refetchInterval: 60_000,
  });

  const onChainPairs = useRegistryPairs({ enabled: apiStats.isError });

  if (apiStats.data) {
    return { data: apiStats.data, isPending: false, source: "api" };
  }

  if (!apiStats.isError) {
    return { data: undefined, isPending: true, source: "api" };
  }

  if (onChainPairs.data) {
    const total = onChainPairs.data.length;
    const valid = onChainPairs.data.filter((p) => p.isValid).length;
    const aggregateTvs = onChainPairs.data.reduce((sum, p) => sum + p.tvs, 0n);
    return {
      data: {
        totalPairs: total,
        validPairs: valid,
        revokedPairs: total - valid,
        aggregateTvs: aggregateTvs.toString(),
      },
      isPending: false,
      source: "chain",
    };
  }

  return { data: undefined, isPending: onChainPairs.isPending, source: "chain" };
}
