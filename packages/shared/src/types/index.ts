export type Address = `0x${string}`;
export type Hex = `0x${string}`;

/** Mirror of the registry's TokenWrapperPair struct. */
export interface TokenWrapperPair {
  tokenAddress: Address;
  confidentialTokenAddress: Address;
  isValid: boolean;
}

/** A pair enriched with token metadata for display. */
export interface EnrichedPair extends TokenWrapperPair {
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  wrapperSymbol: string;
  wrapperName: string;
  wrapperDecimals: number;
  /** Underlying-per-wrapped conversion rate, e.g. 10^12 for 18 -> 6 decimals. */
  rate: bigint;
  /** Total Value Shielded approximation from inferredTotalSupply(). */
  tvs: bigint;
}

/** Explicit states of the two-step asynchronous unwrap flow. */
export type UnwrapStatus =
  | "requesting" // unwrap() tx submitted, awaiting confirmation
  | "requested" // UnwrapRequested emitted, id known
  | "decrypting" // public decryption of the encrypted amount in flight
  | "decrypted" // cleartext amount + proof obtained
  | "finalizing" // finalizeUnwrap() tx submitted
  | "finalized" // underlying tokens released
  | "failed"; // any step errored; retryable

/**
 * A persistable unwrap request record (JSON-safe: no bigints). The resume
 * point after a failure is derived from which fields are present, so no
 * separate "failed at" marker is needed. Note the wrapper contract uses the
 * burned-amount ciphertext handle as the request id, so `unwrapRequestId`
 * is also the handle that gets publicly decrypted.
 */
export interface UnwrapRequest {
  /** Stable local key: the request transaction hash. */
  key: string;
  /** Wallet that initiated the unwrap (records are shown per account). */
  account: Address;
  wrapper: Address;
  wrapperSymbol: string;
  wrapperDecimals: number;
  tokenSymbol: string;
  tokenDecimals: number;
  /** Underlying base units per wrapped base unit, as a decimal string. */
  rate: string;
  receiver: Address;
  status: UnwrapStatus;
  requestTxHash: Hex;
  unwrapRequestId?: Hex;
  /** Cleartext wrapper base units, as a decimal string, after decryption. */
  cleartextAmount?: string;
  decryptionProof?: Hex;
  finalizeTxHash?: Hex;
  /** Last error message when status is "failed"; drives the retry path. */
  error?: string;
  createdAt: number;
  updatedAt: number;
}

/** Activity feed event types indexed from public on-chain data. */
export type ActivityType =
  | "wrap"
  | "unwrap_requested"
  | "unwrap_finalized"
  | "pair_registered"
  | "pair_revoked";

export interface ActivityEvent {
  type: ActivityType;
  pairAddress: Address;
  actor?: Address;
  txHash: Hex;
  blockNumber: number;
  timestamp: number;
  /** Only present where the protocol makes an amount public (wrap, finalized unwrap). */
  publicAmount?: string;
}

export interface TvsSnapshot {
  pairAddress: Address;
  tvs: string;
  timestamp: number;
}

export interface GlobalStats {
  totalPairs: number;
  validPairs: number;
  revokedPairs: number;
  aggregateTvs: string;
}

/**
 * A registered pair as served by the read API (apps/api). Same fields as
 * EnrichedPair, but `rate`/`tvs` are decimal strings (JSON has no bigint),
 * plus the registration metadata the indexer captures that a live on-chain
 * read doesn't carry.
 */
export interface IndexedPair {
  tokenAddress: Address;
  confidentialTokenAddress: Address;
  isValid: boolean;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  wrapperSymbol: string;
  wrapperName: string;
  wrapperDecimals: number;
  rate: string;
  tvs: string;
  /** Unix ms. */
  registeredAt: number;
  /** Unix ms, or null while the pair is still valid. */
  revokedAt: number | null;
}
