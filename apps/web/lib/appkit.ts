"use client";

// Reown AppKit bootstrap. Created once, browser-only, at module scope.
// Exposed as a plain handle instead of the useAppKit hook so components can
// render during static prerendering, where createAppKit never runs.

import { createAppKit } from "@reown/appkit/react";
import { sepolia } from "@reown/appkit/networks";
import { env } from "@/config/env";
import { networks, wagmiAdapter } from "@/lib/wagmi";

export const appKit =
  typeof window !== "undefined" && env.reownProjectId
    ? createAppKit({
        adapters: [wagmiAdapter],
        networks: networks as [typeof sepolia],
        defaultNetwork: sepolia,
        projectId: env.reownProjectId,
        metadata: {
          name: "Obscura",
          description:
            "Confidential Wrapper Registry — wrap, unwrap, and decrypt ERC-7984 confidential tokens on Sepolia",
          url: window.location.origin,
          icons: [],
        },
        themeMode: "dark",
        themeVariables: {
          "--w3m-accent": "#2b5cff",
        },
        features: {
          analytics: false,
          email: false,
          socials: false,
        },
      })
    : undefined;

export function openWalletModal() {
  void appKit?.open();
}
