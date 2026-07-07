// The two networks the Wrappers Registry is deployed on. Sepolia is the
// interactive network (wrap, unwrap, faucet, decrypt); Ethereum mainnet is
// browsable read-only. The explorer helpers default to Sepolia so existing
// call sites keep working unchanged.

import {
  SEPOLIA_CHAIN_ID,
  SEPOLIA_EXPLORER_URL,
  WRAPPERS_REGISTRY_ADDRESS,
} from "./sepolia";
import {
  MAINNET_CHAIN_ID,
  MAINNET_EXPLORER_URL,
  MAINNET_WRAPPERS_REGISTRY_ADDRESS,
} from "./mainnet";

export type RegistryNetwork = "sepolia" | "mainnet";

export interface RegistryNetworkConfig {
  /** Human-readable name shown in the UI. */
  label: string;
  chainId: number;
  registryAddress: `0x${string}`;
  explorerUrl: string;
}

export const REGISTRY_NETWORKS: Record<RegistryNetwork, RegistryNetworkConfig> =
  {
    sepolia: {
      label: "Sepolia",
      chainId: SEPOLIA_CHAIN_ID,
      registryAddress: WRAPPERS_REGISTRY_ADDRESS,
      explorerUrl: SEPOLIA_EXPLORER_URL,
    },
    mainnet: {
      label: "Ethereum",
      chainId: MAINNET_CHAIN_ID,
      registryAddress: MAINNET_WRAPPERS_REGISTRY_ADDRESS,
      explorerUrl: MAINNET_EXPLORER_URL,
    },
  };

export function explorerAddressUrl(
  address: string,
  network: RegistryNetwork = "sepolia",
): string {
  return `${REGISTRY_NETWORKS[network].explorerUrl}/address/${address}`;
}

export function explorerTxUrl(
  txHash: string,
  network: RegistryNetwork = "sepolia",
): string {
  return `${REGISTRY_NETWORKS[network].explorerUrl}/tx/${txHash}`;
}
