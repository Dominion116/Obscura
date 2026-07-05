import { ActivityEvent, type ActivityEventDoc } from "../models/ActivityEvent";
import type { ActivityEvent as ActivityEventDto, ActivityType } from "@obscura/shared";

function toDto(doc: ActivityEventDoc): ActivityEventDto {
  return {
    type: doc.type,
    pairAddress: doc.pairAddress as `0x${string}`,
    actor: (doc.actor as `0x${string}`) ?? undefined,
    txHash: doc.txHash as `0x${string}`,
    blockNumber: doc.blockNumber,
    timestamp: doc.timestamp.getTime(),
    publicAmount: doc.publicAmount ?? undefined,
  };
}

export async function listActivity(filter: {
  pair?: string;
  type?: ActivityType;
  actor?: string;
  page: number;
  pageSize: number;
}): Promise<{ events: ActivityEventDto[]; total: number }> {
  const query: Record<string, unknown> = {};
  if (filter.pair) query.pairAddress = filter.pair.toLowerCase();
  if (filter.type) query.type = filter.type;
  if (filter.actor) query.actor = filter.actor.toLowerCase();

  const [docs, total] = await Promise.all([
    ActivityEvent.find(query)
      .sort({ timestamp: -1 })
      .skip((filter.page - 1) * filter.pageSize)
      .limit(filter.pageSize)
      .lean(),
    ActivityEvent.countDocuments(query),
  ]);

  return { events: docs.map(toDto), total };
}
