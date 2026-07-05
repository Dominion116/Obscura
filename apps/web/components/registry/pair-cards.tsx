import type { EnrichedPair } from "@obscura/shared";
import { AddressLink } from "./address-link";
import { ValidityBadge } from "./validity-badge";
import { formatRate, formatTokenAmount } from "@/lib/format";

/** Mobile layout: the same pair data as the table, stacked as cards. */
export function PairCards({ pairs }: { pairs: EnrichedPair[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {pairs.map((pair) => (
        <li
          key={pair.confidentialTokenAddress}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {pair.tokenSymbol}
                <span className="text-muted-foreground"> → </span>
                {pair.wrapperSymbol}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {pair.tokenName}
              </p>
            </div>
            <ValidityBadge isValid={pair.isValid} />
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Rate</dt>
              <dd className="mt-0.5 font-mono text-xs">
                {formatRate(pair.rate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Decimals</dt>
              <dd className="mt-0.5 font-mono text-xs">
                {pair.tokenDecimals} → {pair.wrapperDecimals}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                <abbr title="Total Value Shielded" className="no-underline">
                  TVS
                </abbr>
              </dt>
              <dd className="mt-0.5 text-xs">
                <span className="font-medium">
                  {formatTokenAmount(pair.tvs, pair.wrapperDecimals)}
                </span>{" "}
                <span className="text-muted-foreground">
                  {pair.tokenSymbol}
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Token <AddressLink address={pair.tokenAddress} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Wrapper <AddressLink address={pair.confidentialTokenAddress} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
