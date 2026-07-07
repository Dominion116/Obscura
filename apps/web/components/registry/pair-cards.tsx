"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { EnrichedPair, RegistryNetwork } from "@obscura/shared";
import { Button } from "@/components/ui/button";
import { AddressLink } from "./address-link";
import { ValidityBadge } from "./validity-badge";
import { formatRate, formatTokenAmount } from "@/lib/format";

/**
 * Mobile layout: the same pair data as the table, stacked as cards. Mainnet
 * cards are read-only (actions run on Sepolia), so the actions button is
 * omitted there.
 */
export function PairCards({
  pairs,
  onSelect,
  network = "sepolia",
}: {
  pairs: EnrichedPair[];
  onSelect: (pair: EnrichedPair) => void;
  network?: RegistryNetwork;
}) {
  const readOnly = network === "mainnet";
  return (
    <ul className="flex flex-col gap-3">
      {pairs.map((pair, index) => (
        <motion.li
          key={pair.confidentialTokenAddress}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.32,
            delay: Math.min(index, 10) * 0.04,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          whileHover={{ y: -3 }}
          className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
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
            <ValidityBadge isValid={pair.isValid} source={pair.source} />
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
              Token <AddressLink address={pair.tokenAddress} network={network} />
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Wrapper{" "}
              <AddressLink
                address={pair.confidentialTokenAddress}
                network={network}
              />
            </span>
          </div>

          {!readOnly && (
            <Button
              variant="outline"
              onClick={() => onSelect(pair)}
              className="mt-4 w-full"
            >
              Open actions
              <ChevronRight className="ml-1.5 size-4" aria-hidden />
            </Button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
