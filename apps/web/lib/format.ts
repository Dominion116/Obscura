import { formatUnits } from "viem";

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Format a raw token amount for display with thousands grouping.
 * Display-only: precision loss past 2^53 is acceptable here.
 */
export function formatTokenAmount(
  value: bigint,
  decimals: number,
  maximumFractionDigits = 2,
): string {
  const asNumber = Number(formatUnits(value, decimals));
  if (!Number.isFinite(asNumber)) return formatUnits(value, decimals);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(
    asNumber,
  );
}

/**
 * Render a wrapper conversion rate (underlying base units per wrapped base
 * unit). Rates are powers of ten by construction, so show the exponent form
 * when they are; a zero rate means the read failed and renders as a dash.
 */
export function formatRate(rate: bigint): string {
  if (rate <= 0n) return "—";
  if (rate === 1n) return "1 : 1";
  const digits = rate.toString();
  if (/^10*$/.test(digits)) return `10^${digits.length - 1} : 1`;
  return `${new Intl.NumberFormat("en-US").format(rate)} : 1`;
}
