"use client";

import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";
import { env } from "@/config/env";
import { openWalletModal } from "@/lib/appkit";
import { cn, shortAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const disabled = !env.reownProjectId;

  return (
    <button
      type="button"
      onClick={openWalletModal}
      disabled={disabled}
      title={
        disabled
          ? "Set NEXT_PUBLIC_REOWN_PROJECT_ID to enable wallet connection"
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-(--radius-btn) px-4 py-2 text-sm font-medium transition-colors",
        isConnected
          ? "glass text-foreground hover:border-cobalt-500/50"
          : "bg-cobalt-500 text-white hover:bg-cobalt-600",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <Wallet className="size-4" aria-hidden />
      {isConnected && address ? shortAddress(address) : "Connect wallet"}
    </button>
  );
}
