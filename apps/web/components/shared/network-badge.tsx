"use client";

import { useAccount } from "wagmi";
import { SEPOLIA_CHAIN_ID } from "@obscura/shared";
import { cn } from "@/lib/utils";

export function NetworkBadge() {
  const { chainId, isConnected } = useAccount();
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        "glass",
        wrongNetwork ? "text-revoked" : "text-muted",
      )}
      title={
        wrongNetwork
          ? "Connected to the wrong network — switch to Sepolia"
          : "Obscura runs on Ethereum Sepolia"
      }
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          wrongNetwork ? "bg-revoked" : "bg-valid",
        )}
      />
      {wrongNetwork ? "Wrong network" : "Sepolia"}
    </span>
  );
}
