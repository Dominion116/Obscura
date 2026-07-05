"use client";

// Wrap tab of the pair actions drawer (PRD §7.3). The preview always shows
// exactly what the contract will do: the wrapper rounds the entered amount
// down to a multiple of rate, pulls only the rounded amount, and credits
// amount / rate confidential units. The remainder never leaves the wallet.

import { useState } from "react";
import Link from "next/link";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { CheckCircle2, Droplets, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import {
  explorerTxUrl,
  KNOWN_WRAPPERS,
  type EnrichedPair,
} from "@obscura/shared";
import { computeWrapPreview, parseAmountInput } from "@/lib/wrap-math";
import { formatTokenAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useUnderlyingBalance, useWrapFlow, type WrapStep } from "@/hooks/use-wrap";
import { useWalletReady, WalletGateNotice } from "@/components/shared/wallet-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function isKnownMock(pair: EnrichedPair): boolean {
  return KNOWN_WRAPPERS.some(
    (w) =>
      w.isMock &&
      w.underlying.toLowerCase() === pair.tokenAddress.toLowerCase(),
  );
}

export function WrapForm({ pair }: { pair: EnrichedPair }) {
  const { ready } = useWalletReady();
  const balanceQuery = useUnderlyingBalance(pair.tokenAddress);
  const { step, error, txHash, wrap, reset } = useWrapFlow(pair);
  const [input, setInput] = useState("");
  const [lastWrap, setLastWrap] = useState<{
    rounded: bigint;
    wrapped: bigint;
  } | null>(null);

  // Correctness rule (PRD §7.2): revoked wrappers are blocked from wrapping.
  if (!pair.isValid) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="text-sm">
          <p className="font-medium">This wrapper has been revoked</p>
          <p className="mt-1 text-muted-foreground">
            The registry marks {pair.wrapperSymbol} as no longer valid, so
            wrapping is disabled. Existing holders can still unwrap back to
            the underlying token.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) return <WalletGateNotice />;

  if (pair.rate <= 0n) {
    return (
      <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        The conversion rate for this wrapper could not be read. Refresh the
        registry and try again.
      </p>
    );
  }

  if (step === "success" && txHash && lastWrap) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="size-8 text-chart-2" aria-hidden />
        <div>
          <p className="font-medium">Wrap confirmed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You wrapped{" "}
            <span className="font-medium text-foreground">
              {formatUnits(lastWrap.rounded, pair.tokenDecimals)}{" "}
              {pair.tokenSymbol}
            </span>{" "}
            and received{" "}
            <span className="font-medium text-foreground">
              {formatUnits(lastWrap.wrapped, pair.wrapperDecimals)}{" "}
              {pair.wrapperSymbol}
            </span>
            , now encrypted on-chain. Only you can decrypt this balance.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setInput("");
              setLastWrap(null);
            }}
          >
            Wrap more
          </Button>
          <a
            href={explorerTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View transaction
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    );
  }

  const balance = balanceQuery.data;
  const parsed = input ? parseAmountInput(input, pair.tokenDecimals) : null;
  const preview =
    parsed !== null && parsed > 0n
      ? computeWrapPreview(parsed, pair.rate)
      : null;

  let validation: string | null = null;
  if (input && parsed === null) {
    validation = `Enter a valid amount with at most ${pair.tokenDecimals} decimal places.`;
  } else if (preview && balance !== undefined && preview.amount > balance) {
    validation = `Insufficient balance: you have ${formatTokenAmount(balance, pair.tokenDecimals, 6)} ${pair.tokenSymbol}.`;
  } else if (preview && preview.wrapped === 0n) {
    validation = `Below the minimum wrap of ${formatUnits(pair.rate, pair.tokenDecimals)} ${pair.tokenSymbol}.`;
  } else if (preview && !preview.fitsUint64) {
    validation = "Amount is too large for the wrapper. Try a smaller amount.";
  }

  const busy = step === "approving" || step === "wrapping";
  const canSubmit =
    !busy && preview !== null && validation === null && balance !== undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !preview) return;
    setLastWrap({ rounded: preview.roundedAmount, wrapped: preview.wrapped });
    const hash = await wrap(preview.amount, preview.roundedAmount);
    if (hash) {
      toast.success(
        `Wrapped ${formatUnits(preview.roundedAmount, pair.tokenDecimals)} ${pair.tokenSymbol} into ${pair.wrapperSymbol}`,
      );
    } else {
      setLastWrap(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <label htmlFor="wrap-amount" className="font-medium">
          Amount to wrap
        </label>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          Balance:{" "}
          {balanceQuery.isPending ? (
            <Skeleton className="h-3.5 w-16" />
          ) : balance !== undefined ? (
            <>
              {formatTokenAmount(balance, pair.tokenDecimals, 6)}{" "}
              {pair.tokenSymbol}
            </>
          ) : (
            "-"
          )}
        </span>
      </div>

      <div className="relative">
        <Input
          id="wrap-amount"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0.0"
          inputMode="decimal"
          autoComplete="off"
          disabled={busy}
          aria-invalid={Boolean(validation)}
          aria-describedby={validation ? "wrap-validation" : undefined}
          className="pr-20 font-mono"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy || balance === undefined || balance === 0n}
          onClick={() =>
            balance !== undefined &&
            setInput(formatUnits(balance, pair.tokenDecimals))
          }
          className="absolute right-1 top-1/2 h-7 -translate-y-1/2 px-2 text-xs"
        >
          Max
        </Button>
      </div>

      {validation && (
        <p id="wrap-validation" className="text-sm text-destructive">
          {validation}
        </p>
      )}

      {isKnownMock(pair) && balance === 0n && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Droplets className="size-4 shrink-0 text-primary" aria-hidden />
          <span>
            This is an official Zama mock token:{" "}
            <Link href="/faucet" className="text-primary hover:underline">
              mint free test {pair.tokenSymbol} at the faucet
            </Link>
            .
          </span>
        </p>
      )}

      {preview && validation === null && (
        <dl className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Actually wrapped</dt>
            <dd className="font-mono">
              {formatUnits(preview.roundedAmount, pair.tokenDecimals)}{" "}
              {pair.tokenSymbol}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">You receive</dt>
            <dd className="font-mono">
              {formatUnits(preview.wrapped, pair.wrapperDecimals)}{" "}
              {pair.wrapperSymbol}
            </dd>
          </div>
          {preview.dust > 0n && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Stays in your wallet</dt>
              <dd className="font-mono">
                {formatUnits(preview.dust, pair.tokenDecimals)}{" "}
                {pair.tokenSymbol}
              </dd>
            </div>
          )}
          {preview.dust > 0n && (
            <p className="text-xs text-muted-foreground">
              The wrapper only accepts multiples of{" "}
              {formatUnits(pair.rate, pair.tokenDecimals)} {pair.tokenSymbol}{" "}
              ({pair.wrapperDecimals}-decimal precision). The remainder is
              never pulled from your wallet.
            </p>
          )}
        </dl>
      )}

      {busy && <StepIndicator step={step} />}

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <p className="font-medium">The wrap did not complete</p>
          <p className="mt-1 break-words text-muted-foreground">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nothing further was submitted. You can adjust the amount and try
            again. An already-confirmed approval is reused automatically.
          </p>
        </div>
      )}

      <Button type="submit" disabled={!canSubmit}>
        {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
        {step === "approving"
          ? `Approving ${pair.tokenSymbol}…`
          : step === "wrapping"
            ? "Wrapping…"
            : `Wrap ${pair.tokenSymbol}`}
      </Button>
      <p className="text-xs text-muted-foreground">
        Two wallet prompts when a new approval is needed: first approve the
        wrapper to pull {pair.tokenSymbol}, then the wrap itself.
      </p>
    </form>
  );
}

function StepIndicator({ step }: { step: WrapStep }) {
  const steps = [
    { key: "approving", label: "1 · Approve" },
    { key: "wrapping", label: "2 · Wrap" },
  ] as const;
  return (
    <ol className="flex items-center gap-3 text-xs" aria-live="polite">
      {steps.map(({ key, label }) => {
        const isActive = step === key;
        const isDone = key === "approving" && step === "wrapping";
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1",
              isActive
                ? "border-primary/50 bg-accent text-accent-foreground"
                : isDone
                  ? "border-border text-muted-foreground line-through"
                  : "border-border text-muted-foreground",
            )}
          >
            {isActive && (
              <Loader2 className="size-3 animate-spin" aria-hidden />
            )}
            {isDone && <CheckCircle2 className="size-3" aria-hidden />}
            {label}
          </li>
        );
      })}
    </ol>
  );
}
