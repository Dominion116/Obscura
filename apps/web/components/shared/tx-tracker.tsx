"use client";

// Transaction tracker (PRD §7.1): because the unwrap flow is asynchronous,
// the tracker is a permanent part of the navigation. It lists the connected
// account's unwrap requests with their live state and lets any interrupted
// or failed one be resumed from anywhere in the app.

import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { useAccount } from "wagmi";
import { removeUnwrap, useUnwrapRequests } from "@/lib/unwrap-store";
import { useUnwrapActions } from "@/hooks/use-unwrap";
import { UnwrapRequestItem } from "@/components/shared/unwrap-request-item";
import { Button } from "@/components/ui/button";

export function TxTracker() {
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const allRequests = useUnwrapRequests();
  const { resumeUnwrap, busyKey } = useUnwrapActions();

  const requests = useMemo(
    () =>
      address
        ? allRequests.filter(
            (r) => r.account.toLowerCase() === address.toLowerCase(),
          )
        : [],
    [allRequests, address],
  );
  // Everything unfinished needs attention, including failed requests,
  // which still hold burned tokens until they are finalized.
  const pendingCount = requests.filter((r) => r.status !== "finalized").length;
  const finishedCount = requests.length - pendingCount;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          pendingCount > 0
            ? `Transaction tracker, ${pendingCount} pending`
            : "Transaction tracker"
        }
        className="relative"
      >
        <Activity className="size-4" aria-hidden />
        {pendingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {pendingCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Transactions"
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg sm:w-96"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Unwrap requests</p>
            {finishedCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  requests
                    .filter((r) => r.status === "finalized")
                    .forEach((r) => removeUnwrap(r.key))
                }
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear finished
              </button>
            )}
          </div>

          {requests.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {address
                ? "No unwrap requests yet. Asynchronous unwraps appear here with their live state, and survive page reloads."
                : "Connect a wallet to see your unwrap requests."}
            </p>
          ) : (
            <ul className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto">
              {requests.map((record) => (
                <UnwrapRequestItem
                  key={record.key}
                  record={record}
                  busy={busyKey === record.key}
                  onResume={(r) => void resumeUnwrap(r)}
                  onRemove={(r) => removeUnwrap(r.key)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
