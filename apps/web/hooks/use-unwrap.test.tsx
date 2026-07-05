import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { EnrichedPair } from "@obscura/shared";
import { upsertUnwrap } from "@/lib/unwrap-store";

const ACCOUNT = "0x1111111111111111111111111111111111111111" as const;
const TOKEN = "0x2222222222222222222222222222222222222222" as const;
const WRAPPER = "0x3333333333333333333333333333333333333333" as const;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
const HANDLE =
  "0x9999999999999999999999999999999999999999999999999999999999999" as const;

const {
  writeContractAsync,
  readContract,
  waitForTransactionReceipt,
  parseEventLogs,
  createEncryptedInput,
  publicDecrypt,
  toastSuccess,
} = vi.hoisted(() => ({
  writeContractAsync: vi.fn(),
  readContract: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
  parseEventLogs: vi.fn(),
  createEncryptedInput: vi.fn(),
  publicDecrypt: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({ address: ACCOUNT }),
  useWriteContract: () => ({ writeContractAsync }),
}));

vi.mock("viem", async (importOriginal) => {
  const actual = await importOriginal<typeof import("viem")>();
  return { ...actual, parseEventLogs: (...args: unknown[]) => parseEventLogs(...args) };
});

vi.mock("sonner", () => ({
  toast: { success: toastSuccess, error: vi.fn() },
}));

vi.mock("@/lib/viem", () => ({
  publicClient: {
    readContract: (...args: unknown[]) => readContract(...args),
    waitForTransactionReceipt: (...args: unknown[]) =>
      waitForTransactionReceipt(...args),
  },
}));

vi.mock("@/lib/fhevm", () => ({
  getFhevmInstance: async () => ({
    createEncryptedInput: (...args: unknown[]) => createEncryptedInput(...args),
    publicDecrypt: (...args: unknown[]) => publicDecrypt(...args),
  }),
}));

import { useUnwrapActions } from "./use-unwrap";

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
  window.localStorage.clear();
  writeContractAsync.mockReset();
  readContract.mockReset();
  waitForTransactionReceipt.mockReset();
  parseEventLogs.mockReset();
  createEncryptedInput.mockReset();
  publicDecrypt.mockReset();
  toastSuccess.mockReset();

  createEncryptedInput.mockReturnValue({
    add64: vi.fn(),
    encrypt: vi.fn(async () => ({
      handles: [HANDLE],
      inputProof: new Uint8Array([1, 2, 3]),
    })),
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useUnwrapActions: startUnwrap happy path", () => {
  it("runs request -> decrypt -> finalize and lands on finalized", async () => {
    writeContractAsync
      .mockResolvedValueOnce("0xrequesttx") // unwrap()
      .mockResolvedValueOnce("0xfinalizetx"); // finalizeUnwrap()
    waitForTransactionReceipt
      .mockResolvedValueOnce({ status: "success", logs: [] }) // request receipt
      .mockResolvedValueOnce({ status: "success" }); // finalize receipt
    parseEventLogs.mockReturnValueOnce([
      { args: { unwrapRequestId: HANDLE } },
    ]);
    // Non-zero requester: the request is still open, so the flow must
    // proceed to decrypt + finalize rather than treating it as already done.
    readContract.mockResolvedValueOnce(ACCOUNT); // unwrapRequester
    publicDecrypt.mockResolvedValueOnce({
      clearValues: { [HANDLE]: 42n },
      decryptionProof: "0xproof",
    });

    const { result } = renderHook(() => useUnwrapActions(), { wrapper });

    const record = await act(async () => result.current.startUnwrap(pair, 42n));

    expect(record).toMatchObject({
      status: "finalized",
      unwrapRequestId: HANDLE,
      cleartextAmount: "42",
      decryptionProof: "0xproof",
      finalizeTxHash: "0xfinalizetx",
    });
    expect(writeContractAsync).toHaveBeenCalledTimes(2);
    expect(writeContractAsync.mock.calls[0]![0]).toMatchObject({
      address: WRAPPER,
      functionName: "unwrap",
    });
    expect(writeContractAsync.mock.calls[1]![0]).toMatchObject({
      address: WRAPPER,
      functionName: "finalizeUnwrap",
      args: [HANDLE, 42n, "0xproof"],
    });
    expect(toastSuccess).toHaveBeenCalledOnce();
    expect(result.current.busyKey).toBeNull();
  });
});

describe("useUnwrapActions: already-finalized detection", () => {
  it("resumeUnwrap marks a record finalized without calling finalize when the requester is zero", async () => {
    readContract.mockResolvedValueOnce(ZERO_ADDRESS); // unwrapRequester

    const record = {
      key: "0xrequesttx",
      account: ACCOUNT,
      wrapper: WRAPPER,
      wrapperSymbol: "cUSDC",
      wrapperDecimals: 6,
      tokenSymbol: "USDC",
      tokenDecimals: 18,
      rate: (10n ** 12n).toString(),
      receiver: ACCOUNT,
      status: "requested" as const,
      requestTxHash: "0xrequesttx" as const,
      unwrapRequestId: HANDLE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertUnwrap(record);

    const { result } = renderHook(() => useUnwrapActions(), { wrapper });

    const resumed = await act(async () => result.current.resumeUnwrap(record));

    expect(resumed).toMatchObject({ status: "finalized" });
    // Already finalized (permissionlessly, by someone else) - must not
    // attempt to decrypt or finalize again.
    expect(publicDecrypt).not.toHaveBeenCalled();
    expect(writeContractAsync).not.toHaveBeenCalled();
  });
});

describe("useUnwrapActions: public decryption retry", () => {
  it("retries after a 'not ready' error and eventually finalizes", async () => {
    vi.useFakeTimers();
    writeContractAsync
      .mockResolvedValueOnce("0xrequesttx")
      .mockResolvedValueOnce("0xfinalizetx");
    waitForTransactionReceipt
      .mockResolvedValueOnce({ status: "success", logs: [] })
      .mockResolvedValueOnce({ status: "success" });
    parseEventLogs.mockReturnValueOnce([
      { args: { unwrapRequestId: HANDLE } },
    ]);
    readContract.mockResolvedValueOnce(ACCOUNT);
    publicDecrypt
      .mockRejectedValueOnce(new Error("not ready for decryption"))
      .mockResolvedValueOnce({
        clearValues: { [HANDLE]: 7n },
        decryptionProof: "0xproof",
      });

    const { result } = renderHook(() => useUnwrapActions(), { wrapper });

    // Kick off the flow without awaiting: the first attempt fails
    // immediately, then the retry loop awaits a 3000ms backoff before
    // attempt #2, which succeeds. Advancing timers only makes progress on
    // an already-pending promise chain, so the call must start first.
    // (React logs a benign "act without await" warning here since act()
    // can't know we intend to await `pending` later, once timers advance.)
    const pending = act(() => result.current.startUnwrap(pair, 7n));

    await vi.advanceTimersByTimeAsync(3000);

    const record = await pending;

    expect(record).toMatchObject({ status: "finalized" });
    expect(publicDecrypt).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-'not ready' failure", async () => {
    writeContractAsync.mockResolvedValueOnce("0xrequesttx");
    waitForTransactionReceipt.mockResolvedValueOnce({
      status: "success",
      logs: [],
    });
    parseEventLogs.mockReturnValueOnce([
      { args: { unwrapRequestId: HANDLE } },
    ]);
    readContract.mockResolvedValueOnce(ACCOUNT);
    publicDecrypt.mockRejectedValueOnce(new Error("insufficient permissions"));

    const { result } = renderHook(() => useUnwrapActions(), { wrapper });

    const record = await act(async () => result.current.startUnwrap(pair, 7n));

    expect(record).toMatchObject({ status: "failed" });
    expect(publicDecrypt).toHaveBeenCalledTimes(1);
  });
});

describe("useUnwrapActions: failure and resume", () => {
  it("marks the record failed when finalize is rejected in the wallet, and clears busyKey for a retry", async () => {
    writeContractAsync
      .mockResolvedValueOnce("0xrequesttx")
      .mockRejectedValueOnce(new Error("User rejected the request"));
    waitForTransactionReceipt.mockResolvedValueOnce({
      status: "success",
      logs: [],
    });
    parseEventLogs.mockReturnValueOnce([
      { args: { unwrapRequestId: HANDLE } },
    ]);
    readContract.mockResolvedValueOnce(ACCOUNT);
    publicDecrypt.mockResolvedValueOnce({
      clearValues: { [HANDLE]: 5n },
      decryptionProof: "0xproof",
    });

    const { result } = renderHook(() => useUnwrapActions(), { wrapper });

    const record = await act(async () => result.current.startUnwrap(pair, 5n));
    const error = record?.error;

    expect(record).toMatchObject({ status: "failed" });
    expect(error).toContain("User rejected the request");
    expect(result.current.busyKey).toBeNull();
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
