"use client";

import { useAccount } from "wagmi";
import { SEPOLIA_CHAIN_ID } from "@obscura/shared";
import { cn } from "@/lib/utils";

export function NetworkBadge() {
  const { chainId, isConnected } = useAccount();
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium",
        wrongNetwork ? "text-destructive" : "text-muted-foreground",
      )}
      title={
        wrongNetwork
          ? "Connected to the wrong network. Switch to Sepolia"
          : "Obscura runs on Ethereum Sepolia"
      }
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          wrongNetwork ? "bg-destructive" : "bg-chart-2",
        )}
      />
      {wrongNetwork ? "Wrong network" : "Sepolia"}
    </span>
  );
}
