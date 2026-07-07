// Official Zama deployments on Ethereum mainnet (chain 1).
// Source: https://docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum
// Verified onchain: the registry answers the same slice functions as the
// Sepolia deployment and lists the production pairs (cUSDC, cUSDT, cWETH,
// cBRON, cZAMA, ctGBP, cXAUt, cbbqTGBP, csteakcUSDC). Obscura browses this
// registry read-only; wrap, unwrap, faucet, and decryption run on Sepolia.

export const MAINNET_CHAIN_ID = 1;

export const MAINNET_WRAPPERS_REGISTRY_ADDRESS =
  "0xeb5015fF021DB115aCe010f23F55C2591059bBA0" as const;

export const MAINNET_EXPLORER_URL = "https://etherscan.io";
