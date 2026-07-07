"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { EnrichedPair, RegistryNetwork } from "@obscura/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddressLink } from "./address-link";
import { ValidityBadge } from "./validity-badge";
import { formatRate, formatTokenAmount } from "@/lib/format";

/**
 * Desktop layout: one row per registered pair (PRD §7.2). Mainnet rows are
 * read-only: actions run on Sepolia, so no drawer opens there and the
 * explorer links point at mainnet Etherscan instead.
 */
export function PairTable({
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="rounded-xl border border-border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Underlying token</TableHead>
            <TableHead>Confidential wrapper</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Decimals</TableHead>
            <TableHead>
              <abbr title="Total Value Shielded" className="no-underline">
                TVS
              </abbr>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map((pair, index) => (
            <motion.tr
              key={pair.confidentialTokenAddress}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.28,
                delay: Math.min(index, 12) * 0.025,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              onClick={(e) => {
                if (readOnly) return;
                // Explorer links inside the row keep their own behaviour.
                if ((e.target as HTMLElement).closest("a")) return;
                onSelect(pair);
              }}
              className={
                readOnly
                  ? "border-b transition-colors hover:bg-muted/50"
                  : "cursor-pointer border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              }
            >
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{pair.tokenSymbol}</span>
                  <AddressLink address={pair.tokenAddress} network={network} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{pair.wrapperSymbol}</span>
                  <AddressLink
                    address={pair.confidentialTokenAddress}
                    network={network}
                  />
                </div>
              </TableCell>
              <TableCell
                className="font-mono text-xs text-muted-foreground"
                title="Underlying base units per wrapped base unit"
              >
                {formatRate(pair.rate)}
              </TableCell>
              <TableCell
                className="font-mono text-xs text-muted-foreground"
                title="Underlying decimals → wrapper decimals"
              >
                {pair.tokenDecimals} → {pair.wrapperDecimals}
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  {formatTokenAmount(pair.tvs, pair.wrapperDecimals)}
                </span>{" "}
                <span className="text-xs text-muted-foreground">
                  {pair.tokenSymbol}
                </span>
              </TableCell>
              <TableCell>
                <ValidityBadge isValid={pair.isValid} source={pair.source} />
              </TableCell>
              <TableCell className="text-right">
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSelect(pair)}
                    aria-label={`Open actions for ${pair.tokenSymbol} → ${pair.wrapperSymbol}`}
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
