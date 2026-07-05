import { getAbiItem } from "viem";
import { wrapperAbi, type Address } from "@obscura/shared";
import { publicClient, getBlockTimestamp } from "../lib/viem";
import { Pair } from "../models/Pair";
import { ActivityEvent } from "../models/ActivityEvent";
import { fallbackStartBlock, getCursor, scanInChunks } from "./backfill";
import { env } from "../config/env";

const wrapEvent = getAbiItem({ abi: wrapperAbi, name: "Wrap" });
const unwrapRequestedEvent = getAbiItem({ abi: wrapperAbi, name: "UnwrapRequested" });
const unwrapFinalizedEvent = getAbiItem({ abi: wrapperAbi, name: "UnwrapFinalized" });

/**
 * Scans every known wrapper in one combined address-filtered query per event
 * type, using a single shared cursor. This is safe because a pair can only
 * ever be discovered in the same or an earlier tick than the one that scans
 * past its registration block (the registry indexer always runs first), so
 * the shared cursor never skips a freshly registered pair's history.
 */
export async function runWrapperIndexer(): Promise<void> {
  const pairs = await Pair.find({}, { confidentialTokenAddress: 1 }).lean();
  if (pairs.length === 0) return;
  const addresses = pairs.map((p) => p.confidentialTokenAddress as Address);

  const latest = await publicClient.getBlockNumber();
  const fromBlock = await getCursor("wrappers", fallbackStartBlock(latest));
  if (fromBlock > latest) return;

  await scanInChunks({
    contract: "wrappers",
    address: addresses,
    events: [wrapEvent, unwrapRequestedEvent, unwrapFinalizedEvent],
    fromBlock,
    toBlock: latest,
    chunkSize: env.logChunkSize,
    onLogs: async (logs) => {
      for (const log of logs) {
        const timestamp = await getBlockTimestamp(log.blockNumber as bigint);
        const base = {
          pairAddress: (log.address as Address).toLowerCase(),
          txHash: log.transactionHash as string,
          logIndex: log.logIndex as number,
          blockNumber: Number(log.blockNumber),
          timestamp,
        };

        if (log.eventName === "Wrap") {
          await ActivityEvent.updateOne(
            { txHash: base.txHash, logIndex: base.logIndex },
            {
              $setOnInsert: {
                ...base,
                type: "wrap",
                actor: (log.args.to as Address)?.toLowerCase() ?? null,
                publicAmount: log.args.roundedAmount?.toString() ?? null,
              },
            },
            { upsert: true },
          );
        } else if (log.eventName === "UnwrapRequested") {
          await ActivityEvent.updateOne(
            { txHash: base.txHash, logIndex: base.logIndex },
            {
              $setOnInsert: {
                ...base,
                type: "unwrap_requested",
                actor: (log.args.receiver as Address)?.toLowerCase() ?? null,
                publicAmount: null,
              },
            },
            { upsert: true },
          );
        } else if (log.eventName === "UnwrapFinalized") {
          await ActivityEvent.updateOne(
            { txHash: base.txHash, logIndex: base.logIndex },
            {
              $setOnInsert: {
                ...base,
                type: "unwrap_finalized",
                actor: (log.args.receiver as Address)?.toLowerCase() ?? null,
                publicAmount: log.args.cleartextAmount?.toString() ?? null,
              },
            },
            { upsert: true },
          );
        }
      }
    },
  });
}
