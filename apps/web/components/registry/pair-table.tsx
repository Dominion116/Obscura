import type { EnrichedPair } from "@obscura/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddressLink } from "./address-link";
import { ValidityBadge } from "./validity-badge";
import { formatRate, formatTokenAmount } from "@/lib/format";

/** Desktop layout: one row per registered pair (PRD §7.2). */
export function PairTable({ pairs }: { pairs: EnrichedPair[] }) {
  return (
    <div className="rounded-xl border border-border bg-card">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {pairs.map((pair) => (
            <TableRow key={pair.confidentialTokenAddress}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{pair.tokenSymbol}</span>
                  <AddressLink address={pair.tokenAddress} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{pair.wrapperSymbol}</span>
                  <AddressLink address={pair.confidentialTokenAddress} />
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
                <ValidityBadge isValid={pair.isValid} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
