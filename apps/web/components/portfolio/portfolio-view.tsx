"use client";

// Portfolio (PRD §7.4): the account's confidential holdings, decryptable on
// demand, plus every unwrap request tied to this wallet — the permanent home
// that turns the two-step asynchronous flow (PRD §7.3) into something that
// survives a closed tab.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { RefreshCw, ShieldAlert, Wallet } from "lucide-react";
import type { EnrichedPair } from "@obscura/shared";
import { useRegistryPairs } from "@/hooks/use-registry";
import { usePortfolioHoldings } from "@/hooks/use-portfolio";
import { useUnwrapActions } from "@/hooks/use-unwrap";
import { removeUnwrap, useUnwrapRequests } from "@/lib/unwrap-store";
import { useWalletReady, WalletGateNotice } from "@/components/shared/wallet-gate";
import { UnwrapRequestItem } from "@/components/shared/unwrap-request-item";
import { PairDrawer } from "@/components/pair/pair-drawer";
import { HoldingCard } from "./holding-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function Header() {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every confidential wrapper this wallet holds, decryptable on demand,
        plus every unwrap request from request through finalize.
      </p>
    </header>
  );
}

export function PortfolioView() {
  const { ready } = useWalletReady();
  const { address } = useAccount();
  const [selected, setSelected] = useState<EnrichedPair | null>(null);

  const pairsQuery = useRegistryPairs();
  const holdingsQuery = usePortfolioHoldings(pairsQuery.data, address);
  const { resumeUnwrap, busyKey } = useUnwrapActions();
  const allRequests = useUnwrapRequests();

  const requests = useMemo(
    () =>
      address
        ? allRequests
            .filter((r) => r.account.toLowerCase() === address.toLowerCase())
            .sort((a, b) => b.createdAt - a.createdAt)
        : [],
    [allRequests, address],
  );
  const pending = requests.filter((r) => r.status !== "finalized");
  const history = requests.filter((r) => r.status === "finalized");

  if (!ready) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <WalletGateNotice />
      </div>
    );
  }

  const loading = pairsQuery.isPending || holdingsQuery.isPending;
  const errored = pairsQuery.isError || holdingsQuery.isError;
  const refresh = () => {
    void pairsQuery.refetch();
    void holdingsQuery.refetch();
  };

  return (
    <div className="flex flex-col gap-8">
      <Header />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Holdings</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh holdings"
          >
            <RefreshCw
              className={cn(
                "size-4",
                holdingsQuery.isRefetching && "animate-spin",
              )}
              aria-hidden
            />
          </Button>
        </div>

        {loading ? (
          <HoldingsSkeleton />
        ) : errored ? (
          <ErrorState onRetry={refresh} />
        ) : (holdingsQuery.data?.length ?? 0) === 0 ? (
          <EmptyHoldings />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {holdingsQuery.data!.map(({ pair, handle }) => (
              <HoldingCard
                key={pair.confidentialTokenAddress}
                pair={pair}
                handle={handle}
                onManage={setSelected}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Unwrap requests</h2>
        {requests.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No unwrap requests yet. Start one from a pair&apos;s Unwrap tab in
            the registry — it will appear here with its live state until it
            finalizes.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {pending.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pending
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {pending.map((record) => (
                    <UnwrapRequestItem
                      key={record.key}
                      record={record}
                      busy={busyKey === record.key}
                      onResume={(r) => void resumeUnwrap(r)}
                      onRemove={(r) => removeUnwrap(r.key)}
                    />
                  ))}
                </ul>
              </div>
            )}
            {history.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  History
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {history.map((record) => (
                    <UnwrapRequestItem
                      key={record.key}
                      record={record}
                      busy={false}
                      onResume={(r) => void resumeUnwrap(r)}
                      onRemove={(r) => removeUnwrap(r.key)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <PairDrawer pair={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function HoldingsSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading holdings"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-full" />
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
        <p className="font-medium">Could not read your holdings</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The Sepolia RPC endpoint may be unavailable.
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="mr-2 size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}

function EmptyHoldings() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
      <Wallet className="size-8 text-muted-foreground" aria-hidden />
      <div>
        <p className="font-medium">No confidential balances yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Wrap a token from the registry to see it here.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/registry">Go to registry</Link>
      </Button>
    </div>
  );
}
