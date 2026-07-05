"use client";

// Pair actions drawer (PRD §7.3): all actions for one pair in a right-side
// drawer so the explorer stays in view and the asynchronous unwrap keeps
// running while the user browses.

import type { EnrichedPair } from "@obscura/shared";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressLink } from "@/components/registry/address-link";
import { ValidityBadge } from "@/components/registry/validity-badge";
import { formatRate } from "@/lib/format";
import { WrapForm } from "./wrap-form";
import { UnwrapForm } from "./unwrap-form";
import { BalanceTab } from "./balance-tab";

export function PairDrawer({
  pair,
  onClose,
}: {
  pair: EnrichedPair | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={Boolean(pair)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        {pair && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3 pr-8">
                <SheetTitle>
                  {pair.tokenSymbol}
                  <span className="text-muted-foreground"> → </span>
                  {pair.wrapperSymbol}
                </SheetTitle>
                <ValidityBadge isValid={pair.isValid} />
              </div>
              <SheetDescription>{pair.wrapperName}</SheetDescription>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Token</dt>
                  <dd className="mt-0.5">
                    <AddressLink address={pair.tokenAddress} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Wrapper</dt>
                  <dd className="mt-0.5">
                    <AddressLink address={pair.confidentialTokenAddress} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Rate</dt>
                  <dd
                    className="mt-0.5 font-mono text-xs"
                    title="Underlying base units per wrapped base unit"
                  >
                    {formatRate(pair.rate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Decimals</dt>
                  <dd
                    className="mt-0.5 font-mono text-xs"
                    title="Underlying decimals → wrapper decimals"
                  >
                    {pair.tokenDecimals} → {pair.wrapperDecimals}
                  </dd>
                </div>
              </dl>
            </SheetHeader>

            <Tabs defaultValue="wrap">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wrap">Wrap</TabsTrigger>
                <TabsTrigger value="unwrap">Unwrap</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
              </TabsList>
              <TabsContent value="wrap">
                <WrapForm pair={pair} />
              </TabsContent>
              <TabsContent value="unwrap">
                <UnwrapForm pair={pair} />
              </TabsContent>
              <TabsContent value="balance">
                <BalanceTab pair={pair} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
