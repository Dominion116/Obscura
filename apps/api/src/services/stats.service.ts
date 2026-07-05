import { Pair } from "../models/Pair";
import type { GlobalStats } from "@obscura/shared";

export async function getGlobalStats(): Promise<GlobalStats> {
  const pairs = await Pair.find({}, { isValid: 1, lastTvs: 1 }).lean();
  const validPairs = pairs.filter((p) => p.isValid).length;
  const aggregateTvs = pairs.reduce((sum, p) => sum + BigInt(p.lastTvs || "0"), 0n);
  return {
    totalPairs: pairs.length,
    validPairs,
    revokedPairs: pairs.length - validPairs,
    aggregateTvs: aggregateTvs.toString(),
  };
}
