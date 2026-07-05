import { registryAbi, WRAPPERS_REGISTRY_ADDRESS, type Address } from "@obscura/shared";
import { publicClient } from "../lib/viem";
import { reconcilePair } from "./pair-metadata";
import { fallbackStartBlock } from "./backfill";
import { createLogger } from "../lib/logger";

const logger = createLogger("reconcile");
const SLICE_SIZE = 50n;

/**
 * Reads every pair directly from the registry's current state (PRD §14:
 * "reconcile against on-chain reads"), using the same slice functions the web
 * app's explorer uses. This makes pair coverage correct regardless of how
 * far back eth_getLogs can see: a free-tier RPC's block-range limit can
 * starve the event-driven registry indexer, but it can't hide a pair that
 * exists right now. Event-driven discovery still owns the exact
 * registration timestamp/block and the registration/revocation activity
 * feed entries; this only fills in coverage and keeps isValid honest.
 */
export async function reconcilePairs(): Promise<void> {
  const length = await publicClient.readContract({
    address: WRAPPERS_REGISTRY_ADDRESS,
    abi: registryAbi,
    functionName: "getTokenConfidentialTokenPairsLength",
  });

  const latest = await publicClient.getBlockNumber();
  const fallback = {
    registeredAt: new Date(),
    registeredAtBlock: Number(fallbackStartBlock(latest)),
  };

  let count = 0;
  for (let from = 0n; from < length; from += SLICE_SIZE) {
    const to = from + SLICE_SIZE < length ? from + SLICE_SIZE : length;
    const slice = await publicClient.readContract({
      address: WRAPPERS_REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "getTokenConfidentialTokenPairsSlice",
      args: [from, to],
    });

    for (const pair of slice) {
      await reconcilePair(
        pair.tokenAddress as Address,
        pair.confidentialTokenAddress as Address,
        pair.isValid,
        fallback,
      );
      count++;
    }
  }

  logger.info("Reconciled pairs from registry state", { count });
}
