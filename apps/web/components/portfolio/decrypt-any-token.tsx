"use client";

// Decrypt-any-token flow: paste any ERC-7984 address, registry-listed or
// not, and run the same EIP-712 user decryption the registry drawer uses.
// The result card is keyed by token address so a new lookup always starts
// from a fresh, hidden state.

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, ScanSearch, ShieldAlert } from "lucide-react";
import { formatUnits, getAddress, isAddress } from "viem";
import type { Address } from "@obscura/shared";
import { shortAddress } from "@/lib/format";
import {
  useArbitraryErc7984,
  type ArbitraryToken,
} from "@/hooks/use-arbitrary-token";
import { useDecryptBalance, ZERO_HANDLE } from "@/hooks/use-decrypt";
import { AddressLink } from "@/components/registry/address-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function DecryptAnyToken() {
  const [input, setInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  /** Checksummed address of the last submitted lookup, if any. */
  const [token, setToken] = useState<Address | null>(null);

  const lookup = useArbitraryErc7984(token);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const candidate = input.trim();
    if (!isAddress(candidate)) {
      setFormError("That is not a valid Ethereum address.");
      setToken(null);
      return;
    }
    setFormError(null);
    const next = getAddress(candidate);
    // Same address again: the query key is unchanged, so refetch explicitly
    // (this is the retry path after a transient RPC failure).
    if (next === token) {
      void lookup.refetch();
    } else {
      setToken(next);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div>
        <p className="font-medium">Decrypt any ERC-7984 token</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the address of any confidential token on Sepolia, even one
          outside the registry, to decrypt this wallet&apos;s balance on it.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ERC-7984 token address (0x…)"
          aria-label="ERC-7984 token address"
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-sm"
        />
        <Button type="submit" disabled={lookup.isFetching}>
          {lookup.isFetching ? (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
          ) : (
            <ScanSearch className="mr-2 size-4" aria-hidden />
          )}
          Look up
        </Button>
      </form>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      {token && lookup.isPending && (
        <div role="status" aria-label="Looking up token">
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {lookup.isError && (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {lookup.error instanceof Error
            ? lookup.error.message
            : String(lookup.error)}
        </p>
      )}

      {lookup.data && (
        <ArbitraryTokenCard key={lookup.data.address} token={lookup.data} />
      )}
    </div>
  );
}

function ArbitraryTokenCard({ token }: { token: ArbitraryToken }) {
  const { decrypt, hide, step, error, decrypted } = useDecryptBalance(
    token.address,
  );
  const busy = step !== "idle";

  return (
    <div className="rounded-lg border border-border bg-background/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{token.symbol}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {token.name}
          </p>
        </div>
        <AddressLink address={token.address} />
      </div>

      {token.handle === ZERO_HANDLE ? (
        <p className="mt-3 text-sm text-muted-foreground">
          This wallet has never held {token.symbol}, so there is no ciphertext
          to decrypt yet.
        </p>
      ) : (
        <>
          <p className="mt-3 font-mono text-xl font-semibold tracking-tight">
            {decrypted !== null ? (
              <>
                {formatUnits(decrypted, token.decimals)}{" "}
                <span className="font-sans text-sm font-normal">
                  {token.symbol}
                </span>
              </>
            ) : (
              <span aria-label="Balance hidden">••••••</span>
            )}
          </p>
          <p
            className="mt-1 font-mono text-xs text-muted-foreground"
            title={token.handle}
          >
            ciphertext {shortAddress(token.handle)}
          </p>

          {error && (
            <p className="mt-2 break-words text-sm text-destructive">{error}</p>
          )}

          <div className="mt-3">
            {decrypted === null ? (
              <Button
                size="sm"
                onClick={() => decrypt(token.handle)}
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
                    : "Decrypt balance"}
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={hide}>
                <EyeOff className="mr-2 size-3.5" aria-hidden />
                Hide
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
