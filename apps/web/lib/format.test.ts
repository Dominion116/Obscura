import { describe, expect, it } from "vitest";
import { formatRate, formatTokenAmount, shortAddress } from "./format";

describe("shortAddress", () => {
  it("truncates to first 6 and last 4 characters", () => {
    expect(shortAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "0x1234…5678",
    );
  });
});

describe("formatTokenAmount", () => {
  it("formats base units with thousands grouping", () => {
    expect(formatTokenAmount(1_234_560_000_000_000_000_000n, 18)).toBe(
      "1,234.56",
    );
  });

  it("respects a custom maximumFractionDigits", () => {
    expect(formatTokenAmount(1_234_567n, 6, 6)).toBe("1.234567");
  });

  it("formats zero", () => {
    expect(formatTokenAmount(0n, 18)).toBe("0");
  });
});

describe("formatRate", () => {
  it("renders a zero or negative rate as a dash", () => {
    expect(formatRate(0n)).toBe("-");
    expect(formatRate(-1n)).toBe("-");
  });

  it("renders a 1:1 rate specially", () => {
    expect(formatRate(1n)).toBe("1 : 1");
  });

  it("renders a power-of-ten rate in exponent form", () => {
    expect(formatRate(10n ** 12n)).toBe("10^12 : 1");
  });

  it("renders a non-power-of-ten rate with thousands grouping", () => {
    expect(formatRate(123_456n)).toBe("123,456 : 1");
  });
});
