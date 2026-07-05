// Official Zama deployments on Ethereum Sepolia (chain 11155111).
// Source: https://docs.zama.org/protocol/protocol-apps/addresses/testnet/sepolia
// The registry auto-discovers pairs on chain; the wrapper list below is a
// convenience snapshot for the faucet and for offline reference. The app
// must always treat the registry as the source of truth.

export const SEPOLIA_CHAIN_ID = 11155111;

export const WRAPPERS_REGISTRY_ADDRESS =
  "0x2f0750Bbb0A246059d80e94c454586a7F27a128e" as const;

export interface KnownWrapper {
  name: string;
  symbol: string;
  wrapper: `0x${string}`;
  underlying: `0x${string}`;
  isMock: boolean;
}

export const KNOWN_WRAPPERS: readonly KnownWrapper[] = [
  {
    name: "Confidential USDC (Mock)",
    symbol: "cUSDCMock",
    wrapper: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639",
    underlying: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF",
    isMock: true,
  },
  {
    name: "Confidential USDT (Mock)",
    symbol: "cUSDTMock",
    wrapper: "0x4E7B06D78965594eB5EF5414c357ca21E1554491",
    underlying: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0",
    isMock: true,
  },
  {
    name: "Confidential WETH (Mock)",
    symbol: "cWETHMock",
    wrapper: "0x46208622DA27d91db4f0393733C8BA082ed83158",
    underlying: "0xff54739b16576FA5402F211D0b938469Ab9A5f3F",
    isMock: true,
  },
  {
    name: "Confidential BRON (Mock)",
    symbol: "cBRONMock",
    wrapper: "0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891",
    underlying: "0xFf021fB13cA64e5354c62c954b949a88cfDEb25E",
    isMock: true,
  },
  {
    name: "Confidential ZAMA (Mock)",
    symbol: "cZAMAMock",
    wrapper: "0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB",
    underlying: "0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57",
    isMock: true,
  },
  {
    name: "Confidential tGBP (Mock)",
    symbol: "ctGBPMock",
    wrapper: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC",
    underlying: "0x93c931278A2aad1916783F952f94276eA5111442",
    isMock: true,
  },
  {
    name: "Confidential XAUt (Mock)",
    symbol: "cXAUtMock",
    wrapper: "0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7",
    underlying: "0x24377AE4AA0C45ecEe71225007f17c5D423dd940",
    isMock: true,
  },
  {
    name: "Confidential tGBP",
    symbol: "ctGBP",
    wrapper: "0x167DC962808B32CFFFc7e14B5018c0bE06A3A208",
    underlying: "0xf6Ef9ADB61A48E29E36bc873070A46A3D2667ff3",
    isMock: false,
  },
] as const;

export const SEPOLIA_EXPLORER_URL = "https://sepolia.etherscan.io";

export function explorerAddressUrl(address: string): string {
  return `${SEPOLIA_EXPLORER_URL}/address/${address}`;
}

export function explorerTxUrl(txHash: string): string {
  return `${SEPOLIA_EXPLORER_URL}/tx/${txHash}`;
}
