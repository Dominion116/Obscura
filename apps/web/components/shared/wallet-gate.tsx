"use client";

// Shared preconditions for every write flow: a connected wallet on Sepolia.
// `useWalletReady` reports the state; `WalletGateNotice` renders the matching
// prompt (or nothing when ready), so pages can either replace their content
// with it or show it above disabled controls.

import { Wallet, ArrowLeftRight, Loader2 } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { SEPOLIA_CHAIN_ID } from "@obscura/shared";
import { openWalletModal } from "@/lib/appkit";
import { Button } from "@/components/ui/button";

export function useWalletReady() {
  const { address, chainId } = useAccount();
  return {
    isConnected: Boolean(address),
    isOnSepolia: chainId === SEPOLIA_CHAIN_ID,
    ready: Boolean(address) && chainId === SEPOLIA_CHAIN_ID,
  };
}

export function WalletGateNotice() {
  const { isConnected, ready } = useWalletReady();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  if (ready) return null;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
        <Wallet className="size-8 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium">Connect a wallet to continue</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Transactions are signed locally by your wallet. Obscura never
            holds keys or funds.
          </p>
        </div>
        <Button onClick={openWalletModal}>
          <Wallet className="mr-2 size-4" aria-hidden />
          Connect wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
      <ArrowLeftRight className="size-8 text-muted-foreground" aria-hidden />
      <div>
        <p className="font-medium">Wrong network</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Obscura runs on Ethereum Sepolia. Switch networks to continue.
        </p>
      </div>
      <Button
        onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}
        disabled={isSwitching}
      >
        {isSwitching ? (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        ) : (
          <ArrowLeftRight className="mr-2 size-4" aria-hidden />
        )}
        Switch to Sepolia
      </Button>
    </div>
  );
}
