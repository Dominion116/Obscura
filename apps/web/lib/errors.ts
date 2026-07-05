import {
  BaseError,
  ContractFunctionRevertedError,
  UserRejectedRequestError,
} from "viem";

// Plain-language messages for the documented contract failure modes
// (PRD §13): every surfaced error says what happened and what to do next
// instead of leaking a raw revert string.
const CONTRACT_ERRORS: Record<string, string> = {
  BlockedUser:
    "This wrapper has blocked your address, so you cannot wrap or hold it.",
  UnderlyingDenyListedAddress:
    "The underlying token has deny-listed your address.",
  ERC7984InvalidReceiver:
    "The recipient address cannot receive confidential tokens.",
  ERC7984TotalSupplyOverflow:
    "This wrap would push the wrapper past its maximum supply. Try a smaller amount.",
  SafeERC20FailedOperation:
    "The underlying token transfer failed. Check your balance and allowance.",
  SafeCastOverflowedUintDowncast:
    "The amount is too large for the wrapper. Try a smaller amount.",
  InvalidKMSSignatures:
    "The decryption proof for this unwrap was rejected on-chain. Wait a moment and retry.",
  InvalidUnwrapRequest:
    "This unwrap request no longer exists, it was likely already finalized. Refresh to see its final state.",
  SenderNotAllowedToUseHandle:
    "You are not permitted to use this encrypted value. Refresh and try again.",
  ERC7984UnauthorizedUseOfEncryptedAmount:
    "This encrypted input can no longer be used. Refresh and try again.",
};

/** Turn a wagmi/viem write error into a message a person can act on. */
export function humanizeWriteError(error: unknown): string {
  if (error instanceof BaseError) {
    if (error.walk((e) => e instanceof UserRejectedRequestError)) {
      return "Transaction rejected in your wallet.";
    }
    const revert = error.walk(
      (e) => e instanceof ContractFunctionRevertedError,
    );
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName;
      if (name && CONTRACT_ERRORS[name]) return CONTRACT_ERRORS[name];
      if (name) return `The contract rejected the transaction (${name}).`;
    }
    return error.shortMessage;
  }
  return error instanceof Error ? error.message : String(error);
}
