"use client";

// UI counterpart to CUSTOM_PAIRS (README "Adding a new pair"): lets a
// visitor declare a pair without touching code or redeploying. Stored in
// their browser only via local-pairs-store, so it never affects what other
// visitors see; the code-configured list is still how a pair ships with the
// app for everyone. Before accepting, both addresses are probed on-chain so
// a mistyped or unrelated address is rejected up front rather than showing
// as a broken row in the explorer.

import { useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { getAddress, isAddress } from "viem";
import { erc20Abi, wrapperAbi, type Address } from "@obscura/shared";
import {
  addLocalPair,
  removeLocalPair,
  useLocalPairs,
} from "@/lib/local-pairs-store";
import { publicClient } from "@/lib/viem";
import { shortAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function looksLikeErc20(address: Address): Promise<boolean> {
  try {
    await publicClient.readContract({
      address,
      abi: erc20Abi,
      functionName: "decimals",
    });
    return true;
  } catch {
    return false;
  }
}

async function looksLikeErc7984Wrapper(address: Address): Promise<boolean> {
  try {
    await publicClient.readContract({
      address,
      abi: wrapperAbi,
      functionName: "rate",
    });
    return true;
  } catch {
    return false;
  }
}

export function AddPairForm() {
  const localPairs = useLocalPairs();
  const [tokenInput, setTokenInput] = useState("");
  const [wrapperInput, setWrapperInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAddress(tokenInput.trim())) {
      setError("The underlying token address is not a valid address.");
      return;
    }
    if (!isAddress(wrapperInput.trim())) {
      setError("The wrapper address is not a valid address.");
      return;
    }
    const tokenAddress = getAddress(tokenInput.trim());
    const confidentialTokenAddress = getAddress(wrapperInput.trim());
    if (tokenAddress === confidentialTokenAddress) {
      setError("The token and wrapper addresses must be different.");
      return;
    }

    setChecking(true);
    try {
      const [isToken, isWrapper] = await Promise.all([
        looksLikeErc20(tokenAddress),
        looksLikeErc7984Wrapper(confidentialTokenAddress),
      ]);
      if (!isToken) {
        setError(
          "The underlying token address did not answer decimals(), so it does not look like an ERC-20 token on Sepolia.",
        );
        return;
      }
      if (!isWrapper) {
        setError(
          "The wrapper address did not answer rate(), so it does not look like an ERC-7984 wrapper on Sepolia.",
        );
        return;
      }
      addLocalPair({
        tokenAddress,
        confidentialTokenAddress,
        addedAt: Date.now(),
      });
      setTokenInput("");
      setWrapperInput("");
    } finally {
      setChecking(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
    >
      <div>
        <p className="text-sm font-medium">Add a pair</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Declares a pair in this browser only, no redeploy needed. To ship a
          pair for every visitor, add it to{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            apps/web/config/custom-pairs.ts
          </code>{" "}
          instead (see the README).
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Underlying ERC-20 address (0x…)"
          aria-label="Underlying ERC-20 token address"
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-sm"
        />
        <Input
          value={wrapperInput}
          onChange={(e) => setWrapperInput(e.target.value)}
          placeholder="ERC-7984 wrapper address (0x…)"
          aria-label="ERC-7984 wrapper address"
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Button type="submit" size="sm" disabled={checking}>
          {checking ? (
            <Loader2 className="mr-2 size-3.5 animate-spin" aria-hidden />
          ) : (
            <Plus className="mr-2 size-3.5" aria-hidden />
          )}
          {checking ? "Checking…" : "Add pair"}
        </Button>
      </div>

      {localPairs.length > 0 && (
        <div className="mt-1 flex flex-col gap-1.5 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">
            Your local pairs
          </p>
          <ul className="flex flex-col gap-1">
            {localPairs.map((pair) => (
              <li
                key={pair.confidentialTokenAddress}
                className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground"
              >
                <span title={pair.confidentialTokenAddress}>
                  {shortAddress(pair.tokenAddress)} →{" "}
                  {shortAddress(pair.confidentialTokenAddress)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeLocalPair(pair.confidentialTokenAddress)}
                  aria-label={`Remove local pair ${pair.confidentialTokenAddress}`}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export function AddPairToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onToggle}>
      {open ? (
        <X className="mr-2 size-3.5" aria-hidden />
      ) : (
        <Plus className="mr-2 size-3.5" aria-hidden />
      )}
      {open ? "Close" : "Add a pair"}
    </Button>
  );
}
