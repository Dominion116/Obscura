import { Schema, model } from "mongoose";

// Total Value Shielded history for a pair (PRD §9), sampled periodically by
// the TVS job. Append-only — never mutated, only ever added to.
export interface TvsSnapshotDoc {
  pairAddress: string;
  tvs: string;
  timestamp: Date;
}

const tvsSnapshotSchema = new Schema<TvsSnapshotDoc>({
  pairAddress: { type: String, required: true, lowercase: true },
  tvs: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

tvsSnapshotSchema.index({ pairAddress: 1, timestamp: -1 });

export const TvsSnapshot = model<TvsSnapshotDoc>(
  "TvsSnapshot",
  tvsSnapshotSchema,
);
