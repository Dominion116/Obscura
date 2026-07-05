"use client";

// Confidential holdings aggregation (PRD §7.4): sweep every registered
// wrapper for the connected account's balance handle in one batched read, so
// the portfolio only ever shows wrappers the account actually holds. Each
// holding still decrypts independently through useDecryptBalance — this
// hook only answers "what do I hold", not "how much".

import { useQuery } from "@tanstack/react-query";
import { wrapperAbi, type Address, type EnrichedPair, type Hex } from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { ZERO_HANDLE } from "@/hooks/use-decrypt";

export interface Holding {
  pair: EnrichedPair;
  handle: Hex;
}

export function usePortfolioHoldings(
  pairs: EnrichedPair[] | undefined,
  account: Address | undefined,
) {
  return useQuery({
    queryKey: [
      "confidential-balance",
      "portfolio",
      account,
      pairs?.map((pair) => pair.confidentialTokenAddress),
    ],
    enabled: Boolean(account) && Boolean(pairs),
    refetchInterval: 30_000,
    queryFn: async (): Promise<Holding[]> => {
      const list = pairs ?? [];
      const results = await Promise.allSettled(
        list.map((pair) =>
          publicClient.readContract({
            address: pair.confidentialTokenAddress,
            abi: wrapperAbi,
            functionName: "confidentialBalanceOf",
            args: [account as Address],
          }),
        ),
      );
      const holdings: Holding[] = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value !== ZERO_HANDLE) {
          holdings.push({ pair: list[i]!, handle: result.value });
        }
      });
      return holdings;
    },
  });
}
