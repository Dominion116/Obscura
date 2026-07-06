"use client";

// Registry explorer (PRD §7.2): every registered pair with validity always
// visible, searchable by symbol or address, filterable by validity, with
// per-pair rate, decimals, and TVS, and explorer links for verification.
// Selecting a pair opens the actions drawer (PRD §7.3).

import { useMemo, useState } from "react";
import { RefreshCw, SearchX, ShieldAlert, Search } from "lucide-react";
import type { EnrichedPair } from "@obscura/shared";
import { useRegistryPairs } from "@/hooks/use-registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PairDrawer } from "@/components/pair/pair-drawer";
import { BlurReveal } from "@/components/shared/blur-reveal";
import { PairTable } from "./pair-table";
import { PairCards } from "./pair-cards";

type ValidityFilter = "all" | "valid" | "revoked";

function matchesQuery(pair: EnrichedPair, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    pair.tokenSymbol,
    pair.tokenName,
    pair.wrapperSymbol,
    pair.wrapperName,
    pair.tokenAddress,
    pair.confidentialTokenAddress,
  ].some((field) => field.toLowerCase().includes(q));
}

export function RegistryExplorer() {
  const { data: pairs, isPending, isError, error, refetch, isRefetching } =
    useRegistryPairs();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ValidityFilter>("all");
  const [selected, setSelected] = useState<EnrichedPair | null>(null);

  const counts = useMemo(() => {
    const valid = pairs?.filter((p) => p.isValid).length ?? 0;
    const total = pairs?.length ?? 0;
    return { all: total, valid, revoked: total - valid };
  }, [pairs]);

  const filtered = useMemo(() => {
    if (!pairs) return [];
    return pairs.filter(
      (pair) =>
        (filter === "all" ||
          (filter === "valid" ? pair.isValid : !pair.isValid)) &&
        matchesQuery(pair, query),
    );
  }, [pairs, filter, query]);

  const filters: { key: ValidityFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "valid", label: "Valid" },
    { key: "revoked", label: "Revoked" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <BlurReveal>
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Registry explorer
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every ERC-20 → ERC-7984 wrapper pair registered on Sepolia, read
          live from the canonical Zama registry. Revoked wrappers stay listed
          but are flagged and blocked from wrapping.
        </p>
      </header>
      </BlurReveal>

      <BlurReveal
        delay={0.08}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol, name, or address"
            aria-label="Search pairs by symbol, name, or address"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Filter by validity"
            className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
          >
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  filter === key
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
                <span className="ml-1.5 inline-flex text-xs tabular-nums opacity-70">
                  {isPending ? (
                    <Skeleton className="h-3 w-3" />
                  ) : (
                    counts[key]
                  )}
                </span>
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isPending || isRefetching}
            aria-label="Refresh pairs"
          >
            <RefreshCw
              className={cn("size-4", isRefetching && "animate-spin")}
              aria-hidden
            />
          </Button>
        </div>
      </BlurReveal>

      {isPending ? (
        <PairListSkeleton />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : String(error)}
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          hasPairs={(pairs?.length ?? 0) > 0}
          onClear={() => {
            setQuery("");
            setFilter("all");
          }}
        />
      ) : (
        <>
          <p aria-live="polite" className="sr-only">
            {filtered.length} of {counts.all} pairs shown
          </p>
          <div className="hidden md:block">
            <PairTable pairs={filtered} onSelect={setSelected} />
          </div>
          <div className="md:hidden">
            <PairCards pairs={filtered} onSelect={setSelected} />
          </div>
          <p className="text-xs text-muted-foreground">
            Read live from the registry at every load and refreshed each
            minute, so newly registered pairs appear automatically.
          </p>
        </>
      )}

      <PairDrawer pair={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function PairListSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      role="status"
      aria-label="Loading pairs"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="hidden h-6 w-16 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
      <ShieldAlert className="size-8 text-destructive" aria-hidden />
      <div>
        <p className="font-medium">Could not read the registry</p>
        <p className="mx-auto mt-1 max-w-md break-words text-sm text-muted-foreground">
          The Sepolia RPC endpoint may be unavailable. {message}
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="mr-2 size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}

function EmptyState({
  hasPairs,
  onClear,
}: {
  hasPairs: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden />
      <div>
        <p className="font-medium">
          {hasPairs ? "No pairs match your search" : "No pairs registered yet"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasPairs
            ? "Try a different symbol or address, or clear the filters."
            : "New registrations appear here automatically."}
        </p>
      </div>
      {hasPairs && (
        <Button variant="outline" onClick={onClear}>
          Clear search and filters
        </Button>
      )}
    </div>
  );
}
