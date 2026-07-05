import { Pair, type PairDoc } from "../models/Pair";
import type { IndexedPair } from "@obscura/shared";

function toDto(doc: PairDoc): IndexedPair {
  return {
    tokenAddress: doc.tokenAddress as `0x${string}`,
    confidentialTokenAddress: doc.confidentialTokenAddress as `0x${string}`,
    isValid: doc.isValid,
    tokenSymbol: doc.tokenSymbol,
    tokenName: doc.tokenName,
    tokenDecimals: doc.tokenDecimals,
    wrapperSymbol: doc.wrapperSymbol,
    wrapperName: doc.wrapperName,
    wrapperDecimals: doc.wrapperDecimals,
    rate: doc.rate,
    tvs: doc.lastTvs,
    registeredAt: doc.registeredAt.getTime(),
    revokedAt: doc.revokedAt ? doc.revokedAt.getTime() : null,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listPairs(filter: {
  isValid?: boolean;
  q?: string;
}): Promise<IndexedPair[]> {
  const query: Record<string, unknown> = {};
  if (filter.isValid !== undefined) query.isValid = filter.isValid;
  if (filter.q) {
    const regex = new RegExp(escapeRegex(filter.q), "i");
    query.$or = [
      { tokenSymbol: regex },
      { tokenName: regex },
      { wrapperSymbol: regex },
      { wrapperName: regex },
      { tokenAddress: filter.q.toLowerCase() },
      { confidentialTokenAddress: filter.q.toLowerCase() },
    ];
  }
  const docs = await Pair.find(query).sort({ registeredAt: -1 }).lean();
  return docs.map(toDto);
}

export async function getPairByAddress(address: string): Promise<IndexedPair | null> {
  const lower = address.toLowerCase();
  const doc = await Pair.findOne({
    $or: [{ tokenAddress: lower }, { confidentialTokenAddress: lower }],
  }).lean();
  return doc ? toDto(doc) : null;
}
