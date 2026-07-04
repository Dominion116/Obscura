"use client";

import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";
import { env } from "@/config/env";
import { openWalletModal } from "@/lib/appkit";
import { shortAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const disabled = !env.reownProjectId;

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      onClick={openWalletModal}
      disabled={disabled}
      title={
        disabled
          ? "Set NEXT_PUBLIC_REOWN_PROJECT_ID to enable wallet connection"
          : undefined
      }
    >
      <Wallet className="mr-2 size-4" aria-hidden />
      {isConnected && address ? shortAddress(address) : "Connect wallet"}
    </Button>
  );
}
