import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { env } from "@/config/env";

// Dedicated read-only client, independent of the connected wallet, so the
// explorer works before any wallet is connected. Multicall batching folds a
// full-registry metadata sweep into a handful of RPC round trips.
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(env.sepoliaRpcUrl),
  batch: { multicall: { wait: 16 } },
});
