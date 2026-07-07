"use client";

// Registry read layer (PRD §8.3): the full pair list is always read through
// the slice functions so the explorer keeps working as the registry grows,
// and every pair carries its isValid flag so revoked wrappers are never
// presented as usable. The source is hybrid: the onchain registry is the
// primary source of truth; pairs declared in the local custom-pairs config
// are merged in next; pairs a visitor added themselves through the registry
// UI (stored in their browser only) are merged in last (registry wins over
// custom, custom wins over a visitor's own local pair on the same wrapper).
// The registry exists on Sepolia and Ethereum mainnet; mainnet is
// browse-only, so custom and local pairs (which declare Sepolia addresses)
// are merged on Sepolia only. This hook is deliberately plain viem +
// react-query so integrators can lift it without pulling in the rest of the
// app.

import { useQuery } from "@tanstack/react-query";
import {
  erc20Abi,
  registryAbi,
  wrapperAbi,
  REGISTRY_NETWORKS,
  type Address,
  type EnrichedPair,
  type RegistryNetwork,
  type TokenWrapperPair,
} from "@obscura/shared";
import { CUSTOM_PAIRS } from "@/config/custom-pairs";
import { useLocalPairs, type LocalPairRecord } from "@/lib/local-pairs-store";
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
 * Pairs from a declared list that a set of already-claimed wrapper addresses
 * does not already cover. Used twice: once to layer CUSTOM_PAIRS over the
 * registry, once to layer local (browser-only) pairs over registry + custom.
 * Declared pairs carry no registry validity flag, so they are treated as
 * valid but labelled by source wherever validity is shown.
 */
function pairsMissingFrom(
  declared: readonly { tokenAddress: Address; confidentialTokenAddress: Address }[],
  claimed: ReadonlySet<string>,
): TokenWrapperPair[] {
  return declared
    .filter((pair) => !claimed.has(pair.confidentialTokenAddress.toLowerCase()))
    .map((pair) => ({
      tokenAddress: pair.tokenAddress,
      confidentialTokenAddress: pair.confidentialTokenAddress,
      isValid: true,
    }));
}

function localPairsKey(pairs: readonly LocalPairRecord[]): string {
  return pairs
    .map((p) => p.confidentialTokenAddress.toLowerCase())
    .sort()
    .join(",");
}

/**
 * Every registered pair plus any local custom pairs and browser-added local
 * pairs, enriched for display. Refetches on an interval so newly registered
 * or revoked pairs appear without a redeploy, and immediately when the
 * visitor adds or removes a local pair (it is part of the query key).
 * Defaults to Sepolia; pass network: "mainnet" to browse the Ethereum
 * mainnet registry (read-only, no custom or local pairs).
 */
export function useRegistryPairs(options?: {
  enabled?: boolean;
  network?: RegistryNetwork;
}) {
  const network = options?.network ?? "sepolia";
  const localPairs = useLocalPairs();
  return useQuery({
    queryKey: ["registry", "pairs", network, localPairsKey(localPairs)],
    queryFn: async (): Promise<EnrichedPair[]> => {
      const registryPairs = await fetchAllPairs(network);
      const registered = new Set(
        registryPairs.map((p) => p.confidentialTokenAddress.toLowerCase()),
      );
      const customPairs =
        network === "sepolia" ? pairsMissingFrom(CUSTOM_PAIRS, registered) : [];
      const claimedByCustom = new Set([
        ...registered,
        ...customPairs.map((p) => p.confidentialTokenAddress.toLowerCase()),
      ]);
      const visitorPairs =
        network === "sepolia"
          ? pairsMissingFrom(localPairs, claimedByCustom)
          : [];
      return Promise.all([
        ...registryPairs.map((pair) => enrichPair(pair, "registry", network)),
        ...customPairs.map((pair) => enrichPair(pair, "custom", network)),
        ...visitorPairs.map((pair) => enrichPair(pair, "local", network)),
      ]);
    },
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  });
}
