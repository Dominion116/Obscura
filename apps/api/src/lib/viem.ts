import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { env } from "../config/env";

// Batches concurrent reads into multicall, same trick the web app's client
// uses — a full pair metadata sweep folds into a handful of RPC round trips.
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(env.sepoliaRpcUrl),
  batch: { multicall: { wait: 16 } },
});

const blockTimestampCache = new Map<bigint, Date>();

/** Block timestamps never change once mined, so cache them for the process lifetime. */
export async function getBlockTimestamp(blockNumber: bigint): Promise<Date> {
  const cached = blockTimestampCache.get(blockNumber);
  if (cached) return cached;
  const block = await publicClient.getBlock({ blockNumber });
  const date = new Date(Number(block.timestamp) * 1000);
  blockTimestampCache.set(blockNumber, date);
  return date;
}
