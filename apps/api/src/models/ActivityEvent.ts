import { Schema, model } from "mongoose";
import type { ActivityType } from "@obscura/shared";

// Global activity feed (PRD §7.7), built only from public on-chain data. The
// (txHash, logIndex) pair uniquely identifies a log, so re-scanning the same
// block range on restart upserts instead of duplicating events.
export interface ActivityEventDoc {
  type: ActivityType;
  pairAddress: string;
  actor: string | null;
  txHash: string;
  logIndex: number;
  blockNumber: number;
  timestamp: Date;
  /** Only present where the protocol makes an amount public (wrap, finalized unwrap). */
  publicAmount: string | null;
}

const activityEventSchema = new Schema<ActivityEventDoc>({
  type: {
    type: String,
    required: true,
    enum: [
      "wrap",
      "unwrap_requested",
      "unwrap_finalized",
      "pair_registered",
      "pair_revoked",
    ],
  },
  pairAddress: { type: String, required: true, lowercase: true, index: true },
  actor: { type: String, default: null, lowercase: true },
  txHash: { type: String, required: true },
  logIndex: { type: Number, required: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  publicAmount: { type: String, default: null },
});

activityEventSchema.index({ txHash: 1, logIndex: 1 }, { unique: true });
activityEventSchema.index({ timestamp: -1 });

export const ActivityEvent = model<ActivityEventDoc>(
  "ActivityEvent",
  activityEventSchema,
);
