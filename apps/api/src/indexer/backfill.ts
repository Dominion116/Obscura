import type { AbiEvent, Address } from "viem";
import { publicClient } from "../lib/viem";
import { IndexerState } from "../models/IndexerState";
import { env } from "../config/env";
import { createLogger } from "../lib/logger";

const logger = createLogger("backfill");

/**
 * First block to scan when a cursor doesn't exist yet. Public RPCs generally
 * refuse archive log queries far into the past, so this defaults to a
 * bounded look-back rather than genesis (see REGISTRY_LOOKBACK_BLOCKS).
 */
export function fallbackStartBlock(latest: bigint): bigint {
  if (env.registryStartBlock !== null) return env.registryStartBlock;
  return latest > env.registryLookbackBlocks ? latest - env.registryLookbackBlocks : 0n;
}

export async function getCursor(contract: string, fallback: bigint): Promise<bigint> {
  const state = await IndexerState.findOne({ contract: contract.toLowerCase() });
  return state ? BigInt(state.lastProcessedBlock) + 1n : fallback;
}

async function saveCursor(contract: string, block: bigint): Promise<void> {
  await IndexerState.updateOne(
    { contract: contract.toLowerCase() },
    { $set: { lastProcessedBlock: Number(block) } },
    { upsert: true },
  );
}

/**
 * Scan [fromBlock, toBlock] in bounded chunks, retrying a failed chunk with
 * backoff before giving up, and persisting the cursor after every chunk that
 * succeeds — a crash mid-scan resumes just past the last completed chunk
 * instead of re-scanning from the start or silently skipping ahead.
 *
 * `logs` are typed loosely because a multi-event scan returns a union of
 * decoded shapes (one per event passed); callers switch on `eventName`.
 */
export async function scanInChunks({
  contract,
  address,
  events,
  fromBlock,
  toBlock,
  chunkSize,
  onLogs,
}: {
  contract: string;
  address: Address | Address[];
  events: AbiEvent[];
  fromBlock: bigint;
  toBlock: bigint;
  chunkSize: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLogs: (logs: any[]) => Promise<void>;
}): Promise<void> {
  let from = fromBlock;

  while (from <= toBlock) {
    const to = from + chunkSize - 1n > toBlock ? toBlock : from + chunkSize - 1n;

    let attempt = 0;
    for (;;) {
      try {
        const logs = await publicClient.getLogs({
          address,
          events,
          fromBlock: from,
          toBlock: to,
        });
        if (logs.length > 0) {
          await onLogs(logs);
        }
        await saveCursor(contract, to);
        break;
      } catch (error) {
        attempt++;
        const message = error instanceof Error ? error.message : String(error);
        if (attempt > 5) {
          logger.error("Giving up on chunk after retries", {
            contract,
            from: from.toString(),
            to: to.toString(),
            error: message,
          });
          throw error;
        }
        const delay = 1000 * attempt;
        logger.warn("Chunk failed, retrying", {
          contract,
          from: from.toString(),
          to: to.toString(),
          attempt,
          message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    from = to + 1n;
  }
}
