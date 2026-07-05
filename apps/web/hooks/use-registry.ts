"use client";

// Registry read layer (PRD §8.3): the full pair list is always read through
// the slice functions so the explorer keeps working as the registry grows,
// and every pair carries its isValid flag so revoked wrappers are never
// presented as usable. This hook is deliberately plain viem + react-query so
// integrators can lift it without pulling in the rest of the app.

import { useQuery } from "@tanstack/react-query";
import {
  erc20Abi,
  registryAbi,
  wrapperAbi,
  WRAPPERS_REGISTRY_ADDRESS,
  type EnrichedPair,
  type TokenWrapperPair,
} from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { shortAddress } from "@/lib/format";

const SLICE_SIZE = 50n;

async function fetchAllPairs(): Promise<readonly TokenWrapperPair[]> {
  const length = await publicClient.readContract({
    address: WRAPPERS_REGISTRY_ADDRESS,
    abi: registryAbi,
    functionName: "getTokenConfidentialTokenPairsLength",
  });

  const pairs: TokenWrapperPair[] = [];
  for (let from = 0n; from < length; from += SLICE_SIZE) {
    const to = from + SLICE_SIZE < length ? from + SLICE_SIZE : length;
    const slice = await publicClient.readContract({
      address: WRAPPERS_REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "getTokenConfidentialTokenPairsSlice",
      args: [from, to],
    });
    pairs.push(...slice);
  }
  return pairs;
}

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

/**
 * Attach display metadata to a registry pair. Each read settles on its own
 * (the client batches them into one multicall), so a single misbehaving
 * token degrades to placeholder fields instead of hiding the pair — the
 * registry, not token metadata, decides what is listed.
 */
async function enrichPair(pair: TokenWrapperPair): Promise<EnrichedPair> {
  const token = { address: pair.tokenAddress, abi: erc20Abi } as const;
  const wrapper = {
    address: pair.confidentialTokenAddress,
    abi: wrapperAbi,
  } as const;

  const [
    tokenSymbol,
    tokenName,
    tokenDecimals,
    wrapperSymbol,
    wrapperName,
    wrapperDecimals,
    rate,
    tvs,
  ] = await Promise.allSettled([
    publicClient.readContract({ ...token, functionName: "symbol" }),
    publicClient.readContract({ ...token, functionName: "name" }),
    publicClient.readContract({ ...token, functionName: "decimals" }),
    publicClient.readContract({ ...wrapper, functionName: "symbol" }),
    publicClient.readContract({ ...wrapper, functionName: "name" }),
    publicClient.readContract({ ...wrapper, functionName: "decimals" }),
    publicClient.readContract({ ...wrapper, functionName: "rate" }),
    publicClient.readContract({
      ...wrapper,
      functionName: "inferredTotalSupply",
    }),
  ]);

  return {
    ...pair,
    tokenSymbol: settled(tokenSymbol, shortAddress(pair.tokenAddress)),
    tokenName: settled(tokenName, "Unknown token"),
    tokenDecimals: settled(tokenDecimals, 18),
    wrapperSymbol: settled(
      wrapperSymbol,
      shortAddress(pair.confidentialTokenAddress),
    ),
    wrapperName: settled(wrapperName, "Unknown wrapper"),
    wrapperDecimals: settled(wrapperDecimals, 6),
    rate: settled(rate, 0n),
    tvs: settled(tvs, 0n),
  };
}

/**
 * Every registered pair, enriched for display. Refetches on an interval so
 * newly registered or revoked pairs appear without a redeploy.
 */
export function useRegistryPairs(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["registry", "pairs"],
    queryFn: async (): Promise<EnrichedPair[]> => {
      const pairs = await fetchAllPairs();
      return Promise.all(pairs.map(enrichPair));
    },
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  });
}
