"use client";

// Faucet grid (PRD §7.5): one-click minting per official mock. The token
// list is public data, so it renders without a wallet — only the mint
// buttons need one.

import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Droplets, Loader2, RefreshCw } from "lucide-react";
import { explorerTxUrl } from "@obscura/shared";
import {
  FAUCET_TOKENS_PER_MINT,
  useFaucetTokens,
  useMintMock,
  type FaucetToken,
} from "@/hooks/use-faucet";
import { formatTokenAmount } from "@/lib/format";
import { useWalletReady, WalletGateNotice } from "@/components/shared/wallet-gate";
import { AddressLink } from "@/components/registry/address-link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FaucetGrid() {
  const { ready } = useWalletReady();
  const { data: tokens, isPending, isError, error, refetch } = useFaucetTokens();
  const { mint, minting } = useMintMock();

  async function onMint(token: FaucetToken) {
    try {
      const hash = await mint(token);
      toast.success(
        `Minted ${FAUCET_TOKENS_PER_MINT.toLocaleString("en-US")} ${token.symbol}`,
        {
          description: "Ready to wrap from the registry.",
          action: {
            label: "View tx",
            onClick: () => window.open(explorerTxUrl(hash), "_blank"),
          },
        },
      );
    } catch (err) {
      toast.error("Mint failed", {
        description: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <WalletGateNotice />

      {isPending ? (
        <FaucetSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-medium">Could not read the mock tokens</p>
          <p className="max-w-md break-words text-sm text-muted-foreground">
            The Sepolia RPC endpoint may be unavailable.{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 size-4" aria-hidden />
            Try again
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens?.map((token) => {
            const isMintingThis = minting === token.underlying;
            return (
              <li
                key={token.underlying}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {token.name}
                    </p>
                  </div>
                  <Droplets className="size-4 shrink-0 text-primary" aria-hidden />
                </div>

                <dl className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-xs text-muted-foreground">
                      Your balance
                    </dt>
                    <dd className="font-mono text-xs">
                      {token.balance !== undefined
                        ? `${formatTokenAmount(token.balance, token.decimals)} ${token.symbol}`
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-xs text-muted-foreground">
                      Wraps into
                    </dt>
                    <dd className="text-xs">{token.wrapperSymbol}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-xs text-muted-foreground">Token</dt>
                    <dd>
                      <AddressLink address={token.underlying} />
                    </dd>
                  </div>
                </dl>

                <Button
                  onClick={() => onMint(token)}
                  disabled={!ready || minting !== null}
                  className="mt-auto"
                >
                  {isMintingThis ? (
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  ) : (
                    <Droplets className="mr-2 size-4" aria-hidden />
                  )}
                  {isMintingThis
                    ? "Minting…"
                    : `Mint ${FAUCET_TOKENS_PER_MINT.toLocaleString("en-US")} ${token.symbol}`}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-sm text-muted-foreground">
        Minted a token? Head to the{" "}
        <Link
          href="/registry"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          registry <ArrowRight className="size-3.5" aria-hidden />
        </Link>{" "}
        and open its pair to wrap it into a confidential token.
      </p>
    </div>
  );
}

function FaucetSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading mock tokens"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
