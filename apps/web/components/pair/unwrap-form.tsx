"use client";

// Unwrap tab of the pair actions drawer (PRD §7.3). Runs the two-step flow
// through useUnwrapActions and renders the live state of every request for
// this pair, so an interrupted unwrap is always one click from resuming.
// Note: revoked wrappers can still unwrap; only wrapping is blocked.

import { useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Info, Loader2 } from "lucide-react";
import type { EnrichedPair, UnwrapStatus } from "@obscura/shared";
import { MAX_UINT64, parseAmountInput } from "@/lib/wrap-math";
import { useUnwrapRequests, removeUnwrap } from "@/lib/unwrap-store";
import { useUnwrapActions } from "@/hooks/use-unwrap";
import { useWalletReady, WalletGateNotice } from "@/components/shared/wallet-gate";
import { UnwrapRequestItem } from "@/components/shared/unwrap-request-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STEP_ORDER: Partial<Record<UnwrapStatus, number>> = {
  requesting: 0,
  requested: 1,
  decrypting: 1,
  decrypted: 2,
  finalizing: 2,
};

export function UnwrapForm({ pair }: { pair: EnrichedPair }) {
  const { ready } = useWalletReady();
  const { address } = useAccount();
  const { startUnwrap, resumeUnwrap, busyKey } = useUnwrapActions();
  const allRequests = useUnwrapRequests();
  const [input, setInput] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const requests = useMemo(
    () =>
      allRequests.filter(
        (r) =>
          r.wrapper.toLowerCase() ===
            pair.confidentialTokenAddress.toLowerCase() &&
          address &&
          r.account.toLowerCase() === address.toLowerCase(),
      ),
    [allRequests, pair.confidentialTokenAddress, address],
  );
  const active = requests.find((r) => r.key === activeKey);

  if (!ready) return <WalletGateNotice />;

  const parsed = input ? parseAmountInput(input, pair.wrapperDecimals) : null;
  let validation: string | null = null;
  if (input && parsed === null) {
    validation = `Enter a valid amount with at most ${pair.wrapperDecimals} decimal places.`;
  } else if (parsed !== null && parsed > MAX_UINT64) {
    validation = "Amount is too large for the wrapper.";
  }

  const busy = busyKey !== null;
  const canSubmit = !busy && parsed !== null && parsed > 0n && !validation;
  const underlyingOut =
    parsed !== null && parsed > 0n && !validation ? parsed * pair.rate : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || parsed === null) return;
    setInput("");
    const record = await startUnwrap(pair, parsed);
    if (record) setActiveKey(record.key);
  }

  return (
    <div className="flex flex-col gap-5">
      {!pair.isValid && (
        <p className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          This wrapper is revoked, so wrapping is disabled, but unwrapping
          back to {pair.tokenSymbol} still works.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="unwrap-amount" className="text-sm font-medium">
          Amount to unwrap
        </label>
        <div className="relative">
          <Input
            id="unwrap-amount"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0.0"
            inputMode="decimal"
            autoComplete="off"
            disabled={busy}
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? "unwrap-validation" : undefined}
            className="pr-24 font-mono"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {pair.wrapperSymbol}
          </span>
        </div>

        {validation && (
          <p id="unwrap-validation" className="text-sm text-destructive">
            {validation}
          </p>
        )}

        {underlyingOut !== null && (
          <dl className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">You receive</dt>
              <dd className="font-mono">
                {formatUnits(underlyingOut, pair.tokenDecimals)}{" "}
                {pair.tokenSymbol}
              </dd>
            </div>
          </dl>
        )}

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Your encrypted balance is not checked before submitting: an amount
          above it unwraps as zero. Decrypt your balance in the Balance tab
          first if unsure.
        </p>

        {active && active.status !== "finalized" && active.status !== "failed" && (
          <UnwrapStepIndicator status={active.status} />
        )}

        <Button type="submit" disabled={!canSubmit}>
          {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          {busy ? "Unwrap in progress…" : "Request unwrap"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Unwrapping runs in three steps: the request burns the encrypted
          amount, the amount decrypts publicly through the relayer, then a
          finalize transaction releases {pair.tokenSymbol}. Each step is
          resumable if interrupted.
        </p>
      </form>

      {requests.length > 0 && (
        <section aria-label="Unwrap requests for this pair">
          <h3 className="text-sm font-medium">Your unwraps for this pair</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {requests.map((record) => (
              <UnwrapRequestItem
                key={record.key}
                record={record}
                busy={busyKey === record.key}
                onResume={(r) => {
                  setActiveKey(r.key);
                  void resumeUnwrap(r);
                }}
                onRemove={(r) => removeUnwrap(r.key)}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function UnwrapStepIndicator({ status }: { status: UnwrapStatus }) {
  const current = STEP_ORDER[status] ?? 0;
  const steps = ["Request", "Decrypt", "Finalize"];
  return (
    <ol className="flex items-center gap-2 text-xs" aria-live="polite">
      {steps.map((label, i) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1",
            i === current
              ? "border-primary/50 bg-accent text-accent-foreground"
              : i < current
                ? "border-border text-muted-foreground line-through"
                : "border-border text-muted-foreground",
          )}
        >
          {i === current && (
            <Loader2 className="size-3 animate-spin" aria-hidden />
          )}
          {i + 1} · {label}
        </li>
      ))}
    </ol>
  );
}
