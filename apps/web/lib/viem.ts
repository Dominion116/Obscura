import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet, sepolia } from "viem/chains";
import type { RegistryNetwork } from "@obscura/shared";
import { env } from "@/config/env";

// Dedicated read-only client, independent of the connected wallet, so the
// explorer works before any wallet is connected. Multicall batching folds a
// full-registry metadata sweep into a handful of RPC round trips.
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(env.sepoliaRpcUrl),
  batch: { multicall: { wait: 16 } },
});

// Browses the mainnet Wrappers Registry. Strictly read-only: no wallet ever
// connects to mainnet in this app, and no write path uses this client.
export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(env.mainnetRpcUrl),
  batch: { multicall: { wait: 16 } },
});

export const registryClients: Record<RegistryNetwork, PublicClient> = {
  sepolia: publicClient,
  mainnet: mainnetClient,
};
