import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: required("MONGODB_URI"),
  sepoliaRpcUrl:
    process.env.SEPOLIA_RPC_URL ??
    "https://ethereum-sepolia-rpc.publicnode.com",
  /** Comma-separated list of allowed CORS origins; "*" allows any. */
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  /** How often the indexer polls for new blocks. */
  pollIntervalMs: Number(process.env.INDEXER_POLL_INTERVAL_MS ?? 20_000),
  /** How often the TVS snapshot job runs. */
  tvsIntervalMs: Number(process.env.TVS_INTERVAL_MS ?? 5 * 60_000),
  /**
   * Max block range per eth_getLogs call. Free-tier RPCs are often capped
   * hard (e.g. Alchemy's free plan allows only 10 blocks per call). Raise
   * this if your provider allows a wider range.
   */
  logChunkSize: BigInt(process.env.INDEXER_CHUNK_SIZE ?? 10),
  /**
   * First block to scan on a cold start (no IndexerState yet). This only
   * bounds how far back the *activity feed* sees; current pair coverage
   * comes from reconcilePairs(), a direct registry state read that doesn't
   * depend on log history at all. Override with the registry's actual
   * deployment block for full activity history on an archive-capable RPC.
   */
  registryStartBlock: process.env.REGISTRY_START_BLOCK
    ? BigInt(process.env.REGISTRY_START_BLOCK)
    : null,
  /** Look-back window used when registryStartBlock isn't set. */
  registryLookbackBlocks: BigInt(
    process.env.REGISTRY_LOOKBACK_BLOCKS ?? 5_000,
  ),
} as const;
