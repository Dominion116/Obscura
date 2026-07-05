import { Router } from "express";
import { IndexerState } from "../models/IndexerState";
import { publicClient } from "../lib/viem";

export const healthRouter = Router();

// Service and indexer health, including last processed block (PRD §10, §13)
// so the live demo can be trusted.
healthRouter.get("/health", async (_req, res, next) => {
  try {
    const [states, latestBlock] = await Promise.all([
      IndexerState.find({}).lean(),
      publicClient.getBlockNumber(),
    ]);
    res.json({
      ok: true,
      latestBlock: latestBlock.toString(),
      indexer: Object.fromEntries(
        states.map((s) => [s.contract, s.lastProcessedBlock]),
      ),
    });
  } catch (error) {
    next(error);
  }
});
