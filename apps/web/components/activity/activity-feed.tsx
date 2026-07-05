"use client";

// Activity feed (PRD §7.7): a live stream of wraps, unwraps, registrations,
// and revocations across the whole registry, backed by the indexer. Symbols
// and decimals for display are joined in from the same live registry read
// the explorer uses — the feed itself only ever stores public event data.

import { useMemo, useState } from "react";
import { Inbox, RefreshCw, ShieldAlert } from "lucide-react";
import type { ActivityType, EnrichedPair } from "@obscura/shared";
import { useActivityFeed } from "@/hooks/use-activity";
import { useRegistryPairs } from "@/hooks/use-registry";
import { ActivityItem } from "./activity-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const FILTERS: { key: ActivityType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "wrap", label: "Wraps" },
  { key: "unwrap_requested", label: "Unwrap requests" },
  { key: "unwrap_finalized", label: "Unwraps finalized" },
  { key: "pair_registered", label: "Registrations" },
  { key: "pair_revoked", label: "Revocations" },
];

export function ActivityFeed() {
  const [type, setType] = useState<ActivityType | "all">("all");
  const [page, setPage] = useState(1);

  const feed = useActivityFeed({
    page,
    pageSize: PAGE_SIZE,
    type: type === "all" ? undefined : type,
  });
  const pairsQuery = useRegistryPairs();

  const pairsByAddress = useMemo(() => {
    const map = new Map<string, EnrichedPair>();
    for (const pair of pairsQuery.data ?? []) {
      map.set(pair.confidentialTokenAddress.toLowerCase(), pair);
    }
    return map;
  }, [pairsQuery.data]);

  const events = feed.data?.events ?? [];
  const total = feed.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function onFilterChange(next: ActivityType | "all") {
    setType(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A live stream of wraps, unwraps, registrations, and revocations
          across the whole registry, built entirely from public on-chain
          data.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Filter by event type"
          className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1"
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              aria-pressed={type === key}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                type === key
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => feed.refetch()}
          disabled={feed.isPending || feed.isRefetching}
          aria-label="Refresh activity"
        >
          <RefreshCw
            className={cn("size-4", feed.isRefetching && "animate-spin")}
            aria-hidden
          />
        </Button>
      </div>

      {feed.isPending ? (
        <FeedSkeleton />
      ) : feed.isError ? (
        <ErrorState onRetry={() => feed.refetch()} />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <ActivityItem
                key={`${event.txHash}-${event.blockNumber}-${event.type}-${event.pairAddress}`}
                event={event}
                pair={pairsByAddress.get(event.pairAddress.toLowerCase())}
              />
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      role="status"
      aria-label="Loading activity"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="size-4 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
      <ShieldAlert className="size-8 text-destructive" aria-hidden />
      <div>
        <p className="font-medium">Could not load the activity feed</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          The Obscura API may be unreachable. Unlike the registry, this feed
          is built from indexed history — there is no direct on-chain
          fallback.
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="mr-2 size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <div>
        <p className="font-medium">No activity yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Wraps, unwraps, registrations, and revocations will appear here as
          they happen.
        </p>
      </div>
    </div>
  );
}
