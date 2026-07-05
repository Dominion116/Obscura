import { getAbiItem } from "viem";
import { registryAbi, WRAPPERS_REGISTRY_ADDRESS, type Address } from "@obscura/shared";
import { publicClient, getBlockTimestamp } from "../lib/viem";
import { Pair } from "../models/Pair";
import { ActivityEvent } from "../models/ActivityEvent";
import { fallbackStartBlock, getCursor, scanInChunks } from "./backfill";
import { upsertRegisteredPair } from "./pair-metadata";
import { env } from "../config/env";
import { createLogger } from "../lib/logger";

const logger = createLogger("registry-indexer");

const registeredEvent = getAbiItem({ abi: registryAbi, name: "ConfidentialTokenRegistered" });
const revokedEvent = getAbiItem({ abi: registryAbi, name: "ConfidentialTokenRevoked" });

async function markRevoked(confidentialTokenAddress: Address, timestamp: Date): Promise<void> {
  await Pair.updateOne(
    { confidentialTokenAddress: confidentialTokenAddress.toLowerCase() },
    { $set: { isValid: false, revokedAt: timestamp } },
  );
  logger.info("Pair revoked", { confidentialTokenAddress });
}

export async function runRegistryIndexer(): Promise<void> {
  const latest = await publicClient.getBlockNumber();
  const fromBlock = await getCursor("registry", fallbackStartBlock(latest));
  if (fromBlock > latest) return;

  await scanInChunks({
    contract: "registry",
    address: WRAPPERS_REGISTRY_ADDRESS,
    events: [registeredEvent, revokedEvent],
    fromBlock,
    toBlock: latest,
    chunkSize: env.logChunkSize,
    onLogs: async (logs) => {
      for (const log of logs) {
        const timestamp = await getBlockTimestamp(log.blockNumber as bigint);
        const base = {
          pairAddress: (log.args.confidentialTokenAddress as Address).toLowerCase(),
          actor: null,
          txHash: log.transactionHash as string,
          logIndex: log.logIndex as number,
          blockNumber: Number(log.blockNumber),
          timestamp,
          publicAmount: null,
        };

        if (log.eventName === "ConfidentialTokenRegistered") {
          await upsertRegisteredPair(
            log.args.tokenAddress as Address,
            log.args.confidentialTokenAddress as Address,
            log.blockNumber as bigint,
            timestamp,
          );
          await ActivityEvent.updateOne(
            { txHash: base.txHash, logIndex: base.logIndex },
            { $setOnInsert: { ...base, type: "pair_registered" } },
            { upsert: true },
          );
        } else if (log.eventName === "ConfidentialTokenRevoked") {
          await markRevoked(log.args.confidentialTokenAddress as Address, timestamp);
          await ActivityEvent.updateOne(
            { txHash: base.txHash, logIndex: base.logIndex },
            { $setOnInsert: { ...base, type: "pair_revoked" } },
            { upsert: true },
          );
        }
      }
    },
  });
}
