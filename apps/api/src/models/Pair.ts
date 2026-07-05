import { Schema, model } from "mongoose";

// Canonical, searchable list of registered pairs (PRD §9). Token metadata is
// captured once at registration time: symbols/decimals/rate are immutable
// per the wrapper contracts, only isValid and lastTvs change after that.
export interface PairDoc {
  tokenAddress: string;
  confidentialTokenAddress: string;
  isValid: boolean;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  wrapperSymbol: string;
  wrapperName: string;
  wrapperDecimals: number;
  /** Underlying base units per wrapped base unit, as a decimal string. */
  rate: string;
  /** Total Value Shielded approximation from the last TVS snapshot, as a decimal string. */
  lastTvs: string;
  registeredAt: Date;
  /** Block the ConfidentialTokenRegistered event landed in: the wrapper indexer's scan floor. */
  registeredAtBlock: number;
  revokedAt: Date | null;
}

const pairSchema = new Schema<PairDoc>({
  tokenAddress: { type: String, required: true, lowercase: true },
  confidentialTokenAddress: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  isValid: { type: Boolean, required: true, default: true },
  tokenSymbol: { type: String, required: true },
  tokenName: { type: String, required: true },
  tokenDecimals: { type: Number, required: true },
  wrapperSymbol: { type: String, required: true },
  wrapperName: { type: String, required: true },
  wrapperDecimals: { type: Number, required: true },
  rate: { type: String, required: true },
  lastTvs: { type: String, required: true, default: "0" },
  registeredAt: { type: Date, required: true },
  registeredAtBlock: { type: Number, required: true },
  revokedAt: { type: Date, default: null },
});

export const Pair = model<PairDoc>("Pair", pairSchema);
