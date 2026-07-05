"use client";

// Global activity feed (PRD §7.7): a live stream of wraps, unwraps,
// registrations, and revocations, built entirely from public on-chain data
// through the indexer. There's no meaningful on-chain fallback here: full
// history requires the indexer, so an unreachable API surfaces as an error
// state instead of silently degrading.

import { useQuery } from "@tanstack/react-query";
import type { ActivityType } from "@obscura/shared";
import { api } from "@/lib/api-client";

export function useActivityFeed(params: {
  page: number;
  pageSize: number;
  type?: ActivityType;
}) {
  return useQuery({
    queryKey: ["activity", params.page, params.pageSize, params.type],
    queryFn: () => api.activity(params),
    refetchInterval: 30_000,
  });
}
