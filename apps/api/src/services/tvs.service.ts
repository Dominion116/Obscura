import { TvsSnapshot } from "../models/TvsSnapshot";
import type { TvsSnapshot as TvsSnapshotDto } from "@obscura/shared";

export async function getTvsHistory(
  pairAddress: string,
  from?: Date,
  to?: Date,
): Promise<TvsSnapshotDto[]> {
  const query: Record<string, unknown> = { pairAddress: pairAddress.toLowerCase() };
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    query.timestamp = range;
  }
  const docs = await TvsSnapshot.find(query).sort({ timestamp: 1 }).lean();
  return docs.map((doc) => ({
    pairAddress: doc.pairAddress as `0x${string}`,
    tvs: doc.tvs,
    timestamp: doc.timestamp.getTime(),
  }));
}
