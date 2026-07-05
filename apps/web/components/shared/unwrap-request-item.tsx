"use client";

// One unwrap request with its live state and actions. Shared between the
// pair drawer's pending list and the navigation transaction tracker so the
// user sees the same truth everywhere (PRD §7.3: the request appears in the
// tracker and the portfolio so the user never loses the thread).

import { formatUnits } from "viem";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  RotateCw,
  X,
} from "lucide-react";
import {
  explorerTxUrl,
  type UnwrapRequest,
  type UnwrapStatus,
} from "@obscura/shared";
import { formatTokenAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<UnwrapStatus, string> = {
  requesting: "Submitting request…",
  requested: "Awaiting public decryption",
  decrypting: "Decrypting amount…",
  decrypted: "Ready to finalize",
  finalizing: "Finalizing…",
  finalized: "Completed",
  failed: "Failed",
};

export function UnwrapRequestItem({
  record,
  busy,
  onResume,
  onRemove,
}: {
  record: UnwrapRequest;
  /** True while this record is being advanced in this session. */
  busy: boolean;
  onResume: (record: UnwrapRequest) => void;
  onRemove: (record: UnwrapRequest) => void;
}) {
  const finished = record.status === "finalized";
  const failed = record.status === "failed";
  // Anything unfinished and not currently running can be picked back up —
  // including states like "decrypting" left behind by a closed tab.
  const actionable = !finished && !busy;

  const amount =
    record.cleartextAmount !== undefined
      ? `${formatUnits(BigInt(record.cleartextAmount), record.wrapperDecimals)} ${record.wrapperSymbol}`
      : `Encrypted ${record.wrapperSymbol}`;
  const released =
    record.cleartextAmount !== undefined
      ? `${formatTokenAmount(
          BigInt(record.cleartextAmount) * BigInt(record.rate),
          record.tokenDecimals,
          6,
        )} ${record.tokenSymbol}`
      : null;

  return (
    <li className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{amount}</p>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-1.5 text-xs",
              failed
                ? "text-destructive"
                : finished
                  ? "text-muted-foreground"
                  : "text-primary",
            )}
          >
            {busy && <Loader2 className="size-3 animate-spin" aria-hidden />}
            {finished && <CheckCircle2 className="size-3" aria-hidden />}
            {STATUS_LABEL[record.status]}
          </p>
          {failed && record.error && (
            <p className="mt-1 break-words text-xs text-muted-foreground">
              {record.error}
            </p>
          )}
          {finished && released && (
            <p className="mt-1 text-xs text-muted-foreground">
              Released {released}
            </p>
          )}
        </div>
        {(finished || failed) && !busy && (
          <button
            type="button"
            onClick={() => onRemove(record)}
            aria-label="Remove from list"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {actionable && (
          <Button
            size="sm"
            variant={failed ? "default" : "outline"}
            onClick={() => onResume(record)}
            className="h-7 px-2.5 text-xs"
          >
            <RotateCw className="mr-1.5 size-3" aria-hidden />
            {failed ? "Retry" : "Resume"}
          </Button>
        )}
        <a
          href={explorerTxUrl(record.finalizeTxHash ?? record.requestTxHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View tx
          <ExternalLink className="size-3" aria-hidden />
        </a>
        <span className="text-xs text-muted-foreground">
          {new Date(record.createdAt).toLocaleString()}
        </span>
      </div>
    </li>
  );
}
