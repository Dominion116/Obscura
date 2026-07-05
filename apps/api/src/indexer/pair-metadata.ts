import { erc20Abi, wrapperAbi, type Address } from "@obscura/shared";
import { publicClient } from "../lib/viem";
import { Pair } from "../models/Pair";

/** Symbols/decimals/rate are immutable once deployed, so a single read is always valid to cache. */
async function readPairMetadata(tokenAddress: Address, confidentialTokenAddress: Address) {
  const token = { address: tokenAddress, abi: erc20Abi } as const;
  const wrapper = { address: confidentialTokenAddress, abi: wrapperAbi } as const;

  const [tokenSymbol, tokenName, tokenDecimals, wrapperSymbol, wrapperName, wrapperDecimals, rate] =
    await Promise.all([
      publicClient.readContract({ ...token, functionName: "symbol" }),
      publicClient.readContract({ ...token, functionName: "name" }),
      publicClient.readContract({ ...token, functionName: "decimals" }),
      publicClient.readContract({ ...wrapper, functionName: "symbol" }),
      publicClient.readContract({ ...wrapper, functionName: "name" }),
      publicClient.readContract({ ...wrapper, functionName: "decimals" }),
      publicClient.readContract({ ...wrapper, functionName: "rate" }),
    ]);

  return {
    tokenSymbol,
    tokenName,
    tokenDecimals,
    wrapperSymbol,
    wrapperName,
    wrapperDecimals,
    rate: rate.toString(),
  };
}

/** Authoritative upsert from a ConfidentialTokenRegistered event, where the exact registration block/time is known. */
export async function upsertRegisteredPair(
  tokenAddress: Address,
  confidentialTokenAddress: Address,
  blockNumber: bigint,
  timestamp: Date,
): Promise<void> {
  const metadata = await readPairMetadata(tokenAddress, confidentialTokenAddress);
  await Pair.updateOne(
    { confidentialTokenAddress: confidentialTokenAddress.toLowerCase() },
    {
      $set: {
        tokenAddress: tokenAddress.toLowerCase(),
        confidentialTokenAddress: confidentialTokenAddress.toLowerCase(),
        isValid: true,
        ...metadata,
        registeredAt: timestamp,
        registeredAtBlock: Number(blockNumber),
        revokedAt: null,
      },
      $setOnInsert: { lastTvs: "0" },
    },
    { upsert: true },
  );
}

/**
 * Best-effort upsert from a direct registry state read (PRD §14: "reconcile
 * against on-chain reads"). Used to seed/correct pair coverage independent
 * of how far back eth_getLogs can see; registeredAt/registeredAtBlock are
 * only ever set as a fallback on first insert, never overwriting the exact
 * values a registration event already recorded.
 */
export async function reconcilePair(
  tokenAddress: Address,
  confidentialTokenAddress: Address,
  isValid: boolean,
  fallback: { registeredAt: Date; registeredAtBlock: number },
): Promise<void> {
  const metadata = await readPairMetadata(tokenAddress, confidentialTokenAddress);
  await Pair.updateOne(
    { confidentialTokenAddress: confidentialTokenAddress.toLowerCase() },
    {
      $set: {
        tokenAddress: tokenAddress.toLowerCase(),
        confidentialTokenAddress: confidentialTokenAddress.toLowerCase(),
        isValid,
        ...metadata,
      },
      $setOnInsert: {
        lastTvs: "0",
        registeredAt: fallback.registeredAt,
        registeredAtBlock: fallback.registeredAtBlock,
        revokedAt: isValid ? null : fallback.registeredAt,
      },
    },
    { upsert: true },
  );
}
