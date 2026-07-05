import { describe, expect, it } from "vitest";
import {
  BaseError,
  ContractFunctionRevertedError,
  UserRejectedRequestError,
  encodeErrorResult,
} from "viem";
import { wrapperAbi } from "@obscura/shared";
import { humanizeWriteError } from "./errors";

const ADDRESS = "0x1234567890123456789012345678901234567890" as const;

function revertedWith(errorName: string, args: readonly unknown[] = []) {
  const data = encodeErrorResult({
    abi: wrapperAbi,
    errorName,
    args,
  } as never);
  return new ContractFunctionRevertedError({
    abi: wrapperAbi,
    data,
    functionName: "wrap",
  });
}

describe("humanizeWriteError", () => {
  it("recognizes a user rejection over any other cause", () => {
    const error = new BaseError("rejected", {
      cause: new UserRejectedRequestError(new Error("User rejected")),
    });
    expect(humanizeWriteError(error)).toBe(
      "Transaction rejected in your wallet.",
    );
  });

  it("maps a known documented contract error to its plain-language message", () => {
    const error = revertedWith("BlockedUser", [ADDRESS]);
    expect(humanizeWriteError(error)).toBe(
      "This wrapper has blocked your address, so you cannot wrap or hold it.",
    );
  });

  it("maps ERC7984TotalSupplyOverflow", () => {
    const error = revertedWith("ERC7984TotalSupplyOverflow");
    expect(humanizeWriteError(error)).toBe(
      "This wrap would push the wrapper past its maximum supply. Try a smaller amount.",
    );
  });

  it("maps InvalidKMSSignatures (finalizeUnwrap proof rejected)", () => {
    const error = revertedWith("InvalidKMSSignatures");
    expect(humanizeWriteError(error)).toBe(
      "The decryption proof for this unwrap was rejected on-chain. Wait a moment and retry.",
    );
  });

  it("maps InvalidUnwrapRequest (already-finalized race)", () => {
    const error = revertedWith("InvalidUnwrapRequest", [
      `0x${"1".repeat(64)}`,
    ]);
    expect(humanizeWriteError(error)).toBe(
      "This unwrap request no longer exists, it was likely already finalized. Refresh to see its final state.",
    );
  });

  it("falls back to a generic named-error message for an undocumented revert", () => {
    const error = revertedWith("ERC7984ZeroBalance", [
      "0x1234567890123456789012345678901234567890",
    ]);
    expect(humanizeWriteError(error)).toBe(
      "The contract rejected the transaction (ERC7984ZeroBalance).",
    );
  });

  it("falls back to the short message when the cause isn't a revert or rejection", () => {
    const error = new BaseError("Something else went wrong.");
    expect(humanizeWriteError(error)).toBe("Something else went wrong.");
  });

  it("handles a plain Error", () => {
    expect(humanizeWriteError(new Error("network down"))).toBe(
      "network down",
    );
  });

  it("handles a non-Error thrown value", () => {
    expect(humanizeWriteError("oops")).toBe("oops");
    expect(humanizeWriteError(42)).toBe("42");
  });
});
