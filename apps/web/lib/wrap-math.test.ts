import { describe, expect, it } from "vitest";
import { computeWrapPreview, parseAmountInput, MAX_UINT64 } from "./wrap-math";

describe("computeWrapPreview", () => {
  it("rounds down to a multiple of rate and computes the wrapped amount", () => {
    const preview = computeWrapPreview(25_500_000_000_000_000_000n, 10n ** 12n);
    expect(preview).toEqual({
      amount: 25_500_000_000_000_000_000n,
      roundedAmount: 25_500_000_000_000_000_000n,
      dust: 0n,
      wrapped: 25_500_000n,
      fitsUint64: true,
    });
  });

  it("leaves the sub-rate remainder as dust instead of rounding up", () => {
    const amount = 1_000_000_000_000_000_001n; // 1 wei above a clean multiple
    const rate = 10n ** 12n;
    const preview = computeWrapPreview(amount, rate);
    expect(preview).not.toBeNull();
    expect(preview!.dust).toBe(1n);
    expect(preview!.roundedAmount).toBe(amount - 1n);
    expect(preview!.roundedAmount % rate).toBe(0n);
  });

  it("returns null for a non-positive rate", () => {
    expect(computeWrapPreview(100n, 0n)).toBeNull();
    expect(computeWrapPreview(100n, -1n)).toBeNull();
  });

  it("returns null for a negative amount", () => {
    expect(computeWrapPreview(-1n, 10n ** 12n)).toBeNull();
  });

  it("flags amounts that would overflow uint64 once wrapped", () => {
    const rate = 1n;
    const preview = computeWrapPreview(MAX_UINT64 + 1n, rate);
    expect(preview).not.toBeNull();
    expect(preview!.fitsUint64).toBe(false);
  });

  it("allows an amount that wraps to exactly MAX_UINT64", () => {
    const preview = computeWrapPreview(MAX_UINT64, 1n);
    expect(preview).not.toBeNull();
    expect(preview!.fitsUint64).toBe(true);
    expect(preview!.wrapped).toBe(MAX_UINT64);
  });

  it("handles an amount below the minimum wrap (rounds to zero)", () => {
    const preview = computeWrapPreview(1n, 10n ** 12n);
    expect(preview).not.toBeNull();
    expect(preview!.wrapped).toBe(0n);
    expect(preview!.roundedAmount).toBe(0n);
    expect(preview!.dust).toBe(1n);
  });
});

describe("parseAmountInput", () => {
  it("parses a plain decimal into base units", () => {
    expect(parseAmountInput("25.5", 18)).toBe(25_500_000_000_000_000_000n);
  });

  it("parses a whole number with no fraction", () => {
    expect(parseAmountInput("10", 6)).toBe(10_000_000n);
  });

  it("parses a leading-dot decimal", () => {
    expect(parseAmountInput(".5", 6)).toBe(500_000n);
  });

  it("trims surrounding whitespace", () => {
    expect(parseAmountInput("  1.5  ", 6)).toBe(1_500_000n);
  });

  it("rejects more fraction digits than the token supports", () => {
    expect(parseAmountInput("1.1234567", 6)).toBeNull();
  });

  it("accepts exactly as many fraction digits as decimals allows", () => {
    expect(parseAmountInput("1.123456", 6)).toBe(1_123_456n);
  });

  it("rejects non-numeric input", () => {
    expect(parseAmountInput("abc", 18)).toBeNull();
    expect(parseAmountInput("1e5", 18)).toBeNull();
    expect(parseAmountInput("-1", 18)).toBeNull();
    expect(parseAmountInput("1.2.3", 18)).toBeNull();
    expect(parseAmountInput("", 18)).toBeNull();
  });

  it("rejects a bare decimal point", () => {
    expect(parseAmountInput(".", 18)).toBeNull();
  });
});
