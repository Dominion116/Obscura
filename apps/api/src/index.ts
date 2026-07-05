import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDb } from "./lib/db";
import { apiRouter } from "./routes";
import { reconcilePairs } from "./indexer/reconcile";
import { runRegistryIndexer } from "./indexer/registry.indexer";
import { runWrapperIndexer } from "./indexer/wrapper.indexer";
import { runTvsSnapshot } from "./indexer/tvs.job";
import { createLogger } from "./lib/logger";

const logger = createLogger("server");

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Reconcile first: pair coverage/validity comes from a direct state read, so
 * it's correct even if the event scans below are running behind. Registry
 * next: a pair discovered this tick must exist before the wrapper indexer
 * scans it.
 */
async function runIndexerTick(): Promise<void> {
  try {
    await reconcilePairs();
    await runRegistryIndexer();
    await runWrapperIndexer();
  } catch (error) {
    logger.error("Indexer tick failed", { error: errorMessage(error) });
  }
}

async function runTvsTick(): Promise<void> {
  try {
    await runTvsSnapshot();
  } catch (error) {
    logger.error("TVS snapshot failed", { error: errorMessage(error) });
  }
}

async function main(): Promise<void> {
  await connectDb();

  const app = express();
  app.use(
    cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",") }),
  );
  app.use(express.json());
  app.use("/api", apiRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled request error", { error: errorMessage(err) });
    res.status(500).json({ error: "Internal server error" });
  });

  app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port}`);
  });

  // Self-rescheduling rather than setInterval: a tick can legitimately take
  // longer than the poll interval (hundreds of small eth_getLogs chunks on a
  // rate-limited RPC), and setInterval would pile up overlapping runs.
  void (async function loopIndexer() {
    await runIndexerTick();
    setTimeout(() => void loopIndexer(), env.pollIntervalMs);
  })();

  void (async function loopTvs() {
    await runTvsTick();
    setTimeout(() => void loopTvs(), env.tvsIntervalMs);
  })();
}

main().catch((error) => {
  logger.error("Fatal startup error", { error: errorMessage(error) });
  process.exit(1);
});
