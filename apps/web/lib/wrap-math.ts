import { parseUnits } from "viem";

// Pure math for the wrap preview (PRD §7.3). Mirrors the on-chain logic of
// ERC7984ERC20Wrapper.wrap exactly:
//   roundedAmount = amount - (amount % rate)   // pulled from the wallet
//   wrapped       = amount / rate              // minted, must fit uint64
// The remainder never leaves the wallet: the wrapper only transfers the
// rounded amount, so the preview says "stays in your wallet", not "refund".

export const MAX_UINT64 = 2n ** 64n - 1n;

export interface WrapPreview {
  /** Entered amount, in underlying base units. */
  amount: bigint;
  /** What the wrapper actually pulls: amount rounded down to a multiple of rate. */
  roundedAmount: bigint;
  /** Remainder that stays in the wallet. */
  dust: bigint;
  /** Confidential tokens credited, in wrapper base units. */
  wrapped: bigint;
  /** The contract SafeCasts wrapped to uint64 and reverts past it. */
  fitsUint64: boolean;
}

export function computeWrapPreview(
  amount: bigint,
  rate: bigint,
): WrapPreview | null {
  if (rate <= 0n || amount < 0n) return null;
  const dust = amount % rate;
  const wrapped = amount / rate;
  return {
    amount,
    roundedAmount: amount - dust,
    dust,
    wrapped,
    fitsUint64: wrapped <= MAX_UINT64,
  };
}

/**
 * Parse a user-typed decimal amount into base units. Returns null for
 * anything that is not a plain decimal number or that has more fraction
 * digits than the token supports (viem would silently round those).
 */
export function parseAmountInput(
  input: string,
  decimals: number,
): bigint | null {
  const trimmed = input.trim();
  if (!/^(\d+\.?\d*|\.\d+)$/.test(trimmed)) return null;
  const fraction = trimmed.split(".")[1] ?? "";
  if (fraction.length > decimals) return null;
  try {
    return parseUnits(trimmed, decimals);
  } catch {
    return null;
  }
}
