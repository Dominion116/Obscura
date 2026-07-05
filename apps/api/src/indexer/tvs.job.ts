import { wrapperAbi, type Address } from "@obscura/shared";
import { publicClient } from "../lib/viem";
import { Pair } from "../models/Pair";
import { TvsSnapshot } from "../models/TvsSnapshot";
import { createLogger } from "../lib/logger";

const logger = createLogger("tvs-job");

/** Periodic Total Value Shielded sample for every known pair (PRD §7.7, §9). */
export async function runTvsSnapshot(): Promise<void> {
  const pairs = await Pair.find({}, { confidentialTokenAddress: 1 }).lean();
  if (pairs.length === 0) return;

  const timestamp = new Date();
  const results = await Promise.allSettled(
    pairs.map((pair) =>
      publicClient.readContract({
        address: pair.confidentialTokenAddress as Address,
        abi: wrapperAbi,
        functionName: "inferredTotalSupply",
      }),
    ),
  );

  await Promise.all(
    results.map(async (result, i) => {
      const pair = pairs[i]!;
      if (result.status !== "fulfilled") {
        logger.warn("TVS read failed", {
          pair: pair.confidentialTokenAddress,
          error: String(result.reason),
        });
        return;
      }
      const tvs = result.value.toString();
      await Pair.updateOne({ _id: pair._id }, { $set: { lastTvs: tvs } });
      await TvsSnapshot.create({
        pairAddress: pair.confidentialTokenAddress,
        tvs,
        timestamp,
      });
    }),
  );

  logger.info("TVS snapshot complete", { pairs: pairs.length });
}
