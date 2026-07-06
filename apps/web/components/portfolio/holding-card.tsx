"use client";

// One confidential holding (PRD §7.4): decrypts on demand through the same
// user-decryption hook the pair drawer's Balance tab uses, and opens that
// same drawer for wrap, unwrap, and transfer actions on this pair.

import { Eye, EyeOff, Loader2, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { formatUnits } from "viem";
import type { EnrichedPair, Hex } from "@obscura/shared";
import { useDecryptBalance } from "@/hooks/use-decrypt";
import { ValidityBadge } from "@/components/registry/validity-badge";
import { AddressLink } from "@/components/registry/address-link";
import { Button } from "@/components/ui/button";

export function HoldingCard({
  pair,
  handle,
  onManage,
}: {
  pair: EnrichedPair;
  handle: Hex;
  onManage: (pair: EnrichedPair) => void;
}) {
  const { decrypt, hide, step, error, decrypted } = useDecryptBalance(
    pair.confidentialTokenAddress,
  );
  const busy = step !== "idle";

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {pair.tokenSymbol}
            <span className="text-muted-foreground"> → </span>
            {pair.wrapperSymbol}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {pair.wrapperName}
          </p>
        </div>
        <ValidityBadge isValid={pair.isValid} />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Balance</p>
        <p className="mt-1 font-mono text-xl font-semibold tracking-tight">
          {decrypted !== null ? (
            <>
              {formatUnits(decrypted, pair.wrapperDecimals)}{" "}
              <span className="font-sans text-sm font-normal">
                {pair.wrapperSymbol}
              </span>
            </>
          ) : (
            <span aria-label="Balance hidden">••••••</span>
          )}
        </p>
        {error && (
          <p className="mt-1 break-words text-xs text-destructive">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {decrypted === null ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => decrypt(handle)}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" aria-hidden />
            ) : (
              <Eye className="mr-2 size-3.5" aria-hidden />
            )}
            {step === "signing"
              ? "Waiting for signature…"
              : step === "decrypting"
                ? "Decrypting…"
                : "Decrypt"}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={hide}>
            <EyeOff className="mr-2 size-3.5" aria-hidden />
            Hide
          </Button>
        )}
        <Button size="sm" onClick={() => onManage(pair)} className="ml-auto">
          <SlidersHorizontal className="mr-2 size-3.5" aria-hidden />
          Manage
        </Button>
      </div>

      <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        Wrapper <AddressLink address={pair.confidentialTokenAddress} />
      </div>
    </motion.li>
  );
}
