"use client";

// Balance tab of the pair actions drawer (PRD §7.3): the encrypted balance
// stays hidden until the user runs a user decryption: a signed EIP-712
// request that decrypts client-side, visible only to them. The copy draws
// the line between this and the public decryption used during unwraps,
// because keeping the two distinct is a correctness mark of the protocol.

import { Eye, EyeOff, Loader2, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { formatUnits } from "viem";
import type { EnrichedPair } from "@obscura/shared";
import { shortAddress } from "@/lib/format";
import {
  useConfidentialBalanceHandle,
  useDecryptBalance,
  ZERO_HANDLE,
} from "@/hooks/use-decrypt";
import { useWalletReady, WalletGateNotice } from "@/components/shared/wallet-gate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function BalanceTab({ pair }: { pair: EnrichedPair }) {
  const { ready } = useWalletReady();
  const handleQuery = useConfidentialBalanceHandle(pair.confidentialTokenAddress);
  const { decrypt, hide, step, error, decrypted } = useDecryptBalance(
    pair.confidentialTokenAddress,
  );

  if (!ready) return <WalletGateNotice />;

  const handle = handleQuery.data;
  const busy = step !== "idle";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">Confidential balance</p>

        {handleQuery.isPending ? (
          <Skeleton className="mt-2 h-8 w-40" />
        ) : handleQuery.isError ? (
          <div className="mt-2">
            <p className="text-sm text-destructive">
              Could not read the balance handle.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuery.refetch()}
              className="mt-2"
            >
              <RefreshCw className="mr-2 size-3.5" aria-hidden />
              Try again
            </Button>
          </div>
        ) : handle === ZERO_HANDLE ? (
          <>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              0 <span className="text-base font-normal">{pair.wrapperSymbol}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This account has never held {pair.wrapperSymbol}, so there is no
              ciphertext to decrypt yet.
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
              {decrypted !== null ? (
                <>
                  {formatUnits(decrypted, pair.wrapperDecimals)}{" "}
                  <span className="font-sans text-base font-normal">
                    {pair.wrapperSymbol}
                  </span>
                </>
              ) : (
                <span aria-label="Balance hidden">••••••</span>
              )}
            </p>
            {handle && (
              <p
                className="mt-1 font-mono text-xs text-muted-foreground"
                title={handle}
              >
                ciphertext {shortAddress(handle)}
              </p>
            )}

            {error && (
              <p className="mt-2 break-words text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3">
              {decrypted === null ? (
                <Button
                  onClick={() => handle && decrypt(handle)}
                  disabled={busy || !handle}
                >
                  {busy ? (
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  ) : (
                    <Eye className="mr-2 size-4" aria-hidden />
                  )}
                  {step === "signing"
                    ? "Waiting for signature…"
                    : step === "decrypting"
                      ? "Decrypting…"
                      : "Decrypt balance"}
                </Button>
              ) : (
                <Button variant="outline" onClick={hide}>
                  <EyeOff className="mr-2 size-4" aria-hidden />
                  Hide
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-4 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
          Decrypting uses a user decryption: you sign a request bound to a
          throwaway keypair and the balance is re-encrypted to it, so the
          cleartext exists only in this browser. Nothing is stored or sent
          anywhere.
        </p>
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
          This is different from the public decryption used to finalize
          unwraps, where the amount must become public for the contract to
          release the underlying tokens.
        </p>
      </div>
    </div>
  );
}
