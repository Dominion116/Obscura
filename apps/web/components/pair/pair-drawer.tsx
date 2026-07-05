"use client";

// Pair actions drawer (PRD §7.3): all actions for one pair in a right-side
// drawer so the explorer stays in view. Phase 2 ships the Wrap tab; the
// Unwrap and Balance tabs land with Phase 3 and are labelled as such rather
// than hidden, so the drawer's final shape is already visible.

import { Hourglass } from "lucide-react";
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
                <ComingSoon
                  title="Two-step unwrap"
                  description="Request an unwrap, let the amount decrypt publicly, then finalize to release the underlying tokens — with every pending request tracked. Ships in Phase 3."
                />
              </TabsContent>
              <TabsContent value="balance">
                <ComingSoon
                  title="Encrypted balance"
                  description="Decrypt your confidential balance client-side with a signed request only you can produce. Ships in Phase 3."
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
      <Hourglass className="size-6 text-muted-foreground" aria-hidden />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
