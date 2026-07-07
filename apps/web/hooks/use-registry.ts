"use client";

// Registry read layer (PRD §8.3): the full pair list is always read through
// the slice functions so the explorer keeps working as the registry grows,
// and every pair carries its isValid flag so revoked wrappers are never
// presented as usable. The source is hybrid: the onchain registry is the
// primary source of truth, and pairs declared in the local custom-pairs
// config are merged in after it (registry wins on conflicts). The registry
// exists on Sepolia and Ethereum mainnet; mainnet is browse-only, so custom
// pairs (which declare Sepolia addresses) are merged on Sepolia only. This
// hook is deliberately plain viem + react-query so integrators can lift it
// without pulling in the rest of the app.

import { useQuery } from "@tanstack/react-query";
import {
  erc20Abi,
  registryAbi,
  wrapperAbi,
  REGISTRY_NETWORKS,
  type EnrichedPair,
  type RegistryNetwork,
  type TokenWrapperPair,
} from "@obscura/shared";
import { CUSTOM_PAIRS } from "@/config/custom-pairs";
import { registryClients } from "@/lib/viem";
import { shortAddress } from "@/lib/format";

const SLICE_SIZE = 50n;

async function fetchAllPairs(
  network: RegistryNetwork,
): Promise<readonly TokenWrapperPair[]> {
  const client = registryClients[network];
  const registryAddress = REGISTRY_NETWORKS[network].registryAddress;
  const length = await client.readContract({
    address: registryAddress,
    abi: registryAbi,
    functionName: "getTokenConfidentialTokenPairsLength",
  });

  const pairs: TokenWrapperPair[] = [];
  for (let from = 0n; from < length; from += SLICE_SIZE) {
    const to = from + SLICE_SIZE < length ? from + SLICE_SIZE : length;
    const slice = await client.readContract({
      address: registryAddress,
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
 * token degrades to placeholder fields instead of hiding the pair, so the
 * registry, not token metadata, decides what is listed.
 */
async function enrichPair(
  pair: TokenWrapperPair,
  source: EnrichedPair["source"],
  network: RegistryNetwork,
): Promise<EnrichedPair> {
  const client = registryClients[network];
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
    client.readContract({ ...token, functionName: "symbol" }),
    client.readContract({ ...token, functionName: "name" }),
    client.readContract({ ...token, functionName: "decimals" }),
    client.readContract({ ...wrapper, functionName: "symbol" }),
    client.readContract({ ...wrapper, functionName: "name" }),
    client.readContract({ ...wrapper, functionName: "decimals" }),
    client.readContract({ ...wrapper, functionName: "rate" }),
    client.readContract({
      ...wrapper,
      functionName: "inferredTotalSupply",
    }),
  ]);

  return {
    ...pair,
    source,
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
 * Pairs declared in the local config that the registry does not already
 * list. Registry entries win: if a wrapper later gets officially registered,
 * the local declaration is dropped automatically. Custom pairs carry no
 * registry validity flag, so they are treated as valid but labelled Custom
 * wherever validity is shown.
 */
function customPairsMissingFrom(
  registryPairs: readonly TokenWrapperPair[],
): TokenWrapperPair[] {
  const registered = new Set(
    registryPairs.map((pair) => pair.confidentialTokenAddress.toLowerCase()),
  );
  return CUSTOM_PAIRS.filter(
    (pair) => !registered.has(pair.confidentialTokenAddress.toLowerCase()),
  ).map((pair) => ({
    tokenAddress: pair.tokenAddress,
    confidentialTokenAddress: pair.confidentialTokenAddress,
    isValid: true,
  }));
}

/**
 * Every registered pair plus any local custom pairs, enriched for display.
 * Refetches on an interval so newly registered or revoked pairs appear
 * without a redeploy. Defaults to Sepolia; pass network: "mainnet" to browse
 * the Ethereum mainnet registry (read-only, no custom pairs).
 */
export function useRegistryPairs(options?: {
  enabled?: boolean;
  network?: RegistryNetwork;
}) {
  const network = options?.network ?? "sepolia";
  return useQuery({
    queryKey: ["registry", "pairs", network],
    queryFn: async (): Promise<EnrichedPair[]> => {
      const registryPairs = await fetchAllPairs(network);
      const customPairs =
        network === "sepolia" ? customPairsMissingFrom(registryPairs) : [];
      return Promise.all([
        ...registryPairs.map((pair) => enrichPair(pair, "registry", network)),
        ...customPairs.map((pair) => enrichPair(pair, "custom", network)),
      ]);
    },
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  });
}
