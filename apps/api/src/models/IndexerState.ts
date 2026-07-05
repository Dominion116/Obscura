import { Schema, model } from "mongoose";

// Resumable, gap-free indexing (PRD §9): one cursor document per contract,
// "registry" for the registry itself, and one keyed by wrapper address for
// each pair's Wrap/Unwrap event scan. A crash or restart resumes from
// lastProcessedBlock + 1 instead of re-scanning or losing ground.
export interface IndexerStateDoc {
  contract: string;
  lastProcessedBlock: number;
}

const indexerStateSchema = new Schema<IndexerStateDoc>({
  contract: { type: String, required: true, unique: true, lowercase: true },
  lastProcessedBlock: { type: Number, required: true },
});

export const IndexerState = model<IndexerStateDoc>(
  "IndexerState",
  indexerStateSchema,
);
