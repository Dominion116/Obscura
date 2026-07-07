// Local pair declarations: the second half of the hybrid registry source.
// The onchain Wrappers Registry stays the primary source of truth; pairs
// listed here are merged in after it, labelled "Custom" in the UI, and
// skipped when the registry already lists the same wrapper. Use this to
// expose custom or dev-only wrappers without touching application code.
//
// To add a pair, append an entry and redeploy. Symbol, name, decimals, rate,
// and TVS are all read onchain from the two contracts, so only the addresses
// are declared here. The full process is documented in the README under
// "Adding a new pair".

import type { Address } from "@obscura/shared";

export interface CustomPairConfig {
  /** ERC-20 underlying token address on Sepolia. */
  tokenAddress: Address;
  /** ERC-7984 confidential wrapper address on Sepolia. */
  confidentialTokenAddress: Address;
}

export const CUSTOM_PAIRS: readonly CustomPairConfig[] = [
  // Example: a dev-only wrapper that is not (yet) in the official registry.
  // {
  //   tokenAddress: "0xYourErc20TokenAddress",
  //   confidentialTokenAddress: "0xYourErc7984WrapperAddress",
  // },
];
