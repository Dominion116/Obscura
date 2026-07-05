import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { EnrichedPair } from "@obscura/shared";
import { useWrapFlow } from "./use-wrap";

const ACCOUNT = "0x1111111111111111111111111111111111111111" as const;
const TOKEN = "0x2222222222222222222222222222222222222222" as const;
const WRAPPER = "0x3333333333333333333333333333333333333333" as const;

const writeContractAsync = vi.fn();
const readContract = vi.fn();
const waitForTransactionReceipt = vi.fn();

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: ACCOUNT }),
  useWriteContract: () => ({ writeContractAsync }),
}));

vi.mock("@/lib/viem", () => ({
  publicClient: {
    readContract: (...args: unknown[]) => readContract(...args),
    waitForTransactionReceipt: (...args: unknown[]) =>
      waitForTransactionReceipt(...args),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const pair = {
  tokenAddress: TOKEN,
  confidentialTokenAddress: WRAPPER,
  isValid: true,
  tokenSymbol: "USDC",
  tokenName: "USD Coin",
  tokenDecimals: 18,
  wrapperSymbol: "cUSDC",
  wrapperName: "Confidential USDC",
  wrapperDecimals: 6,
  rate: 10n ** 12n,
  tvs: 0n,
} satisfies EnrichedPair;

beforeEach(() => {
  writeContractAsync.mockReset();
  readContract.mockReset();
  waitForTransactionReceipt.mockReset();
});

describe("useWrapFlow", () => {
  it("skips approval when the allowance already covers the rounded amount and wraps directly", async () => {
    readContract.mockResolvedValueOnce(100_000_000_000_000_000_000n); // allowance
    writeContractAsync.mockResolvedValueOnce("0xwraphash");
    waitForTransactionReceipt.mockResolvedValueOnce({ status: "success" });

    const { result } = renderHook(() => useWrapFlow(pair), { wrapper });

    let hash: string | null = null;
    await act(async () => {
      hash = await result.current.wrap(
        25_000_000_000_000_000_000n,
        25_000_000_000_000_000_000n,
      );
    });

    expect(hash).toBe("0xwraphash");
    expect(writeContractAsync).toHaveBeenCalledTimes(1);
    expect(writeContractAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        address: WRAPPER,
        functionName: "wrap",
        args: [ACCOUNT, 25_000_000_000_000_000_000n],
      }),
    );
    await waitFor(() => expect(result.current.step).toBe("success"));
    expect(result.current.error).toBeNull();
  });

  it("approves before wrapping when the allowance is insufficient, in that order", async () => {
    readContract.mockResolvedValueOnce(0n); // allowance
    writeContractAsync
      .mockResolvedValueOnce("0xapprovehash")
      .mockResolvedValueOnce("0xwraphash");
    waitForTransactionReceipt
      .mockResolvedValueOnce({ status: "success" }) // approval receipt
      .mockResolvedValueOnce({ status: "success" }); // wrap receipt

    const { result } = renderHook(() => useWrapFlow(pair), { wrapper });

    await act(async () => {
      await result.current.wrap(
        25_000_000_000_000_000_000n,
        25_000_000_000_000_000_000n,
      );
    });

    expect(writeContractAsync).toHaveBeenCalledTimes(2);
    expect(writeContractAsync.mock.calls[0]![0]).toMatchObject({
      functionName: "approve",
      address: TOKEN,
      args: [WRAPPER, 25_000_000_000_000_000_000n],
    });
    expect(writeContractAsync.mock.calls[1]![0]).toMatchObject({
      functionName: "wrap",
      address: WRAPPER,
    });
  });

  it("surfaces a humanized error and resets to idle when the approval reverts", async () => {
    readContract.mockResolvedValueOnce(0n);
    writeContractAsync.mockResolvedValueOnce("0xapprovehash");
    waitForTransactionReceipt.mockResolvedValueOnce({ status: "reverted" });

    const { result } = renderHook(() => useWrapFlow(pair), { wrapper });

    await act(async () => {
      const hash = await result.current.wrap(
        25_000_000_000_000_000_000n,
        25_000_000_000_000_000_000n,
      );
      expect(hash).toBeNull();
    });

    expect(result.current.step).toBe("idle");
    expect(result.current.error).toBe("The approval transaction reverted.");
    // Only the approval was attempted; wrap must never fire after a reverted approval.
    expect(writeContractAsync).toHaveBeenCalledTimes(1);
  });

  it("surfaces a humanized error when the wrap transaction itself reverts", async () => {
    readContract.mockResolvedValueOnce(100_000_000_000_000_000_000n);
    writeContractAsync.mockResolvedValueOnce("0xwraphash");
    waitForTransactionReceipt.mockResolvedValueOnce({ status: "reverted" });

    const { result } = renderHook(() => useWrapFlow(pair), { wrapper });

    await act(async () => {
      const hash = await result.current.wrap(
        25_000_000_000_000_000_000n,
        25_000_000_000_000_000_000n,
      );
      expect(hash).toBeNull();
    });

    expect(result.current.step).toBe("idle");
    expect(result.current.error).toBe("The wrap transaction reverted.");
  });

  it("reset clears step, error, and txHash back to idle", async () => {
    readContract.mockResolvedValueOnce(100_000_000_000_000_000_000n);
    writeContractAsync.mockResolvedValueOnce("0xwraphash");
    waitForTransactionReceipt.mockResolvedValueOnce({ status: "success" });

    const { result } = renderHook(() => useWrapFlow(pair), { wrapper });
    await act(async () => {
      await result.current.wrap(
        25_000_000_000_000_000_000n,
        25_000_000_000_000_000_000n,
      );
    });
    await waitFor(() => expect(result.current.step).toBe("success"));

    act(() => result.current.reset());

    expect(result.current.step).toBe("idle");
    expect(result.current.error).toBeNull();
    expect(result.current.txHash).toBeNull();
  });
});
