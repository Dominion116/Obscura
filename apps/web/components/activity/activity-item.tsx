import type { ComponentType } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  PlusCircle,
  ShieldOff,
} from "lucide-react";
import { explorerTxUrl, type ActivityEvent, type EnrichedPair } from "@obscura/shared";
import { formatTokenAmount, shortAddress } from "@/lib/format";
import { AddressLink } from "@/components/registry/address-link";

const ICONS: Record<ActivityEvent["type"], ComponentType<{ className?: string }>> = {
  wrap: ArrowRightLeft,
  unwrap_requested: Clock,
  unwrap_finalized: CheckCircle2,
  pair_registered: PlusCircle,
  pair_revoked: ShieldOff,
};

/**
 * Wrap's publicAmount is underlying (token) base units; unwrap_finalized's is
 * wrapper base units, converted to underlying via the pair's rate. Mirrors
 * the same math the wrap form and unwrap tracker already use.
 */
function describe(event: ActivityEvent, pair: EnrichedPair | undefined) {
  const tokenSymbol = pair?.tokenSymbol ?? shortAddress(event.pairAddress);
  const wrapperSymbol = pair?.wrapperSymbol ?? shortAddress(event.pairAddress);
  const actor = event.actor ? <AddressLink address={event.actor} /> : "Someone";

  switch (event.type) {
    case "pair_registered":
      return (
        <>
          New pair registered: <strong className="font-medium">{tokenSymbol}</strong>{" "}
          → <strong className="font-medium">{wrapperSymbol}</strong>
        </>
      );
    case "pair_revoked":
      return (
        <>
          <strong className="font-medium">{wrapperSymbol}</strong> was revoked by
          the registry
        </>
      );
    case "wrap":
      return (
        <>
          {actor} wrapped{" "}
          {event.publicAmount && pair ? (
            <strong className="font-medium">
              {formatTokenAmount(BigInt(event.publicAmount), pair.tokenDecimals, 6)}{" "}
              {tokenSymbol}
            </strong>
          ) : (
            <strong className="font-medium">{tokenSymbol}</strong>
          )}{" "}
          into {wrapperSymbol}
        </>
      );
    case "unwrap_requested":
      return <>{actor} requested an unwrap of {wrapperSymbol}</>;
    case "unwrap_finalized":
      return (
        <>
          {actor} unwrapped back to{" "}
          {event.publicAmount && pair ? (
            <strong className="font-medium">
              {formatTokenAmount(
                BigInt(event.publicAmount) * pair.rate,
                pair.tokenDecimals,
                6,
              )}{" "}
              {tokenSymbol}
            </strong>
          ) : (
            <strong className="font-medium">{tokenSymbol}</strong>
          )}
        </>
      );
  }
}

export function ActivityItem({
  event,
  pair,
}: {
  event: ActivityEvent;
  pair: EnrichedPair | undefined;
}) {
  const Icon = ICONS[event.type];

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm">{describe(event, pair)}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{new Date(event.timestamp).toLocaleString()}</span>
          <a
            href={explorerTxUrl(event.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            View tx
          </a>
        </div>
      </div>
    </li>
  );
}
