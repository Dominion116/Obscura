// Thin read client for the Obscura API (apps/api). Every call here is a
// public, stateless GET against the indexer's cache — writes always go
// on-chain, signed by the connected wallet, never through this client.

import type {
  ActivityEvent,
  ActivityType,
  GlobalStats,
  IndexedPair,
  TvsSnapshot,
} from "@obscura/shared";
import { env } from "@/config/env";

export class ApiUnavailableError extends Error {}

async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  if (!env.apiUrl) {
    throw new ApiUnavailableError("NEXT_PUBLIC_API_URL is not configured");
  }
  const url = new URL(path, env.apiUrl);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export interface ActivityPage {
  events: ActivityEvent[];
  page: number;
  pageSize: number;
  total: number;
}

export const api = {
  stats: () => apiGet<GlobalStats>("/api/stats"),

  pairs: (params?: { isValid?: boolean; q?: string }) =>
    apiGet<IndexedPair[]>("/api/pairs", {
      isValid: params?.isValid === undefined ? undefined : String(params.isValid),
      q: params?.q,
    }),

  pair: (address: string) => apiGet<IndexedPair>(`/api/pairs/${address}`),

  activity: (params: {
    pair?: string;
    type?: ActivityType;
    actor?: string;
    page: number;
    pageSize: number;
  }) =>
    apiGet<ActivityPage>("/api/activity", {
      pair: params.pair,
      type: params.type,
      actor: params.actor,
      page: String(params.page),
      pageSize: String(params.pageSize),
    }),

  tvsHistory: (address: string, from?: Date, to?: Date) =>
    apiGet<TvsSnapshot[]>(`/api/tvs/${address}`, {
      from: from?.toISOString(),
      to: to?.toISOString(),
    }),
};
