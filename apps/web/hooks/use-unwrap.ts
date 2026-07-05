"use client";

// Two-step asynchronous unwrap (PRD §7.3), run as an explicit state machine:
//
//   request:  encrypt the amount client-side (Relayer SDK input proof) and
//             call unwrap(), which burns the encrypted amount and emits
//             UnwrapRequested. The request id IS the burned-amount
//             ciphertext handle, which the contract makes publicly
//             decryptable at this point.
//   decrypt:  publicly decrypt the handle through the relayer to obtain
//             the cleartext amount and its KMS decryption proof.
//   finalize: call finalizeUnwrap(id, cleartext, proof), which verifies
//             the proof on-chain and releases the underlying tokens.
//
// Every state is persisted (lib/unwrap-store), so any step can fail and be
// resumed later, from the drawer or the transaction tracker, without
// losing funds or re-running earlier steps. resumeUnwrap derives the next
// action from which fields the record already carries.

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import { parseEventLogs, toHex } from "viem";
import { toast } from "sonner";
import {
  wrapperAbi,
  SEPOLIA_CHAIN_ID,
  type EnrichedPair,
  type Hex,
  type UnwrapRequest,
} from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { getFhevmInstance } from "@/lib/fhevm";
import { humanizeWriteError } from "@/lib/errors";
import { patchUnwrap, upsertUnwrap } from "@/lib/unwrap-store";
import { formatTokenAmount } from "@/lib/format";

/**
 * The relayer rejects a public decryption for a short window after the
 * request tx lands ("not ready for decryption"), so poll with a small
 * backoff instead of failing the whole flow on the first attempt.
 */
async function publicDecryptWithRetry(handle: Hex) {
  const instance = await getFhevmInstance();
  let lastError: unknown;
  for (let attempt = 0; attempt < 6; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
    }
    try {
      return await instance.publicDecrypt([handle]);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (!/not.ready|not_ready|429|timeout/i.test(message)) throw error;
    }
  }
  throw lastError;
}

function lookupClearValue(
  clearValues: Readonly<Record<`0x${string}`, bigint | boolean | `0x${string}`>>,
  handle: Hex,
): bigint {
  const key = Object.keys(clearValues).find(
    (k) => k.toLowerCase() === handle.toLowerCase(),
  );
  const value = key ? clearValues[key as `0x${string}`] : undefined;
  if (typeof value !== "bigint") {
    throw new Error("The relayer response did not include the unwrap amount.");
  }
  return value;
}

export function useUnwrapActions() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  /** Key of the record currently being advanced, to disable double-runs. */
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const invalidateBalances = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["erc20-balance"] });
    void queryClient.invalidateQueries({ queryKey: ["confidential-balance"] });
    void queryClient.invalidateQueries({ queryKey: ["registry"] });
  }, [queryClient]);

  /** Decrypt + finalize for a record whose request is already on-chain. */
  const progress = useCallback(
    async (record: UnwrapRequest): Promise<UnwrapRequest> => {
      let current = record;

      // Recover the request id if the tab closed while the tx was pending.
      if (!current.unwrapRequestId) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: current.requestTxHash,
          timeout: 120_000,
        });
        if (receipt.status !== "success") {
          throw new Error("The unwrap request transaction reverted.");
        }
        const [event] = parseEventLogs({
          abi: wrapperAbi,
          eventName: "UnwrapRequested",
          logs: receipt.logs,
        });
        if (!event) {
          throw new Error("No UnwrapRequested event found in the receipt.");
        }
        current = patchUnwrap(current.key, {
          status: "requested",
          unwrapRequestId: event.args.unwrapRequestId,
        })!;
      }
      const id = current.unwrapRequestId!;

      // A zero requester means the request no longer exists on-chain: it
      // was already finalized (possibly by someone else; finalize is
      // permissionless), so just record the completion.
      const requester = await publicClient.readContract({
        address: current.wrapper,
        abi: wrapperAbi,
        functionName: "unwrapRequester",
        args: [id],
      });
      if (requester === "0x0000000000000000000000000000000000000000") {
        return patchUnwrap(current.key, { status: "finalized" })!;
      }

      if (!current.decryptionProof || !current.cleartextAmount) {
        current = patchUnwrap(current.key, { status: "decrypting" })!;
        const result = await publicDecryptWithRetry(id);
        current = patchUnwrap(current.key, {
          status: "decrypted",
          cleartextAmount: lookupClearValue(result.clearValues, id).toString(),
          decryptionProof: result.decryptionProof,
        })!;
      }

      current = patchUnwrap(current.key, { status: "finalizing" })!;
      const finalizeHash = await writeContractAsync({
        chainId: SEPOLIA_CHAIN_ID,
        address: current.wrapper,
        abi: wrapperAbi,
        functionName: "finalizeUnwrap",
        args: [id, BigInt(current.cleartextAmount!), current.decryptionProof!],
      });
      const finalizeReceipt = await publicClient.waitForTransactionReceipt({
        hash: finalizeHash,
      });
      if (finalizeReceipt.status !== "success") {
        throw new Error("The finalize transaction reverted.");
      }

      current = patchUnwrap(current.key, {
        status: "finalized",
        finalizeTxHash: finalizeHash,
      })!;
      invalidateBalances();
      toast.success(
        `Unwrap complete: ${formatTokenAmount(
          BigInt(current.cleartextAmount ?? "0") * BigInt(current.rate),
          current.tokenDecimals,
          6,
        )} ${current.tokenSymbol} released`,
      );
      return current;
    },
    [writeContractAsync, invalidateBalances],
  );

  /** Start a brand-new unwrap for `amount` wrapper base units. */
  const startUnwrap = useCallback(
    async (pair: EnrichedPair, amount: bigint): Promise<UnwrapRequest | null> => {
      if (!address) return null;

      // Encrypt the amount and build the input proof before any tx exists,
      // so a failure here costs nothing.
      const instance = await getFhevmInstance();
      const input = instance.createEncryptedInput(
        pair.confidentialTokenAddress,
        address,
      );
      input.add64(amount);
      const { handles, inputProof } = await input.encrypt();
      const encryptedAmount = handles[0];
      if (!encryptedAmount) {
        throw new Error("The relayer did not return an input handle.");
      }

      const requestTxHash = await writeContractAsync({
        chainId: SEPOLIA_CHAIN_ID,
        address: pair.confidentialTokenAddress,
        abi: wrapperAbi,
        functionName: "unwrap",
        args: [address, address, toHex(encryptedAmount), toHex(inputProof)],
      });

      const record: UnwrapRequest = {
        key: requestTxHash,
        account: address,
        wrapper: pair.confidentialTokenAddress,
        wrapperSymbol: pair.wrapperSymbol,
        wrapperDecimals: pair.wrapperDecimals,
        tokenSymbol: pair.tokenSymbol,
        tokenDecimals: pair.tokenDecimals,
        rate: pair.rate.toString(),
        receiver: address,
        status: "requesting",
        requestTxHash,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      upsertUnwrap(record);
      setBusyKey(record.key);

      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: requestTxHash,
        });
        if (receipt.status !== "success") {
          throw new Error("The unwrap request transaction reverted.");
        }
        const [event] = parseEventLogs({
          abi: wrapperAbi,
          eventName: "UnwrapRequested",
          logs: receipt.logs,
        });
        let current = patchUnwrap(record.key, {
          status: "requested",
          unwrapRequestId: event?.args.unwrapRequestId,
        })!;
        // The confidential balance already shrank at the burn.
        void queryClient.invalidateQueries({
          queryKey: ["confidential-balance"],
        });
        current = await progress(current);
        return current;
      } catch (error) {
        return (
          patchUnwrap(record.key, {
            status: "failed",
            error: humanizeWriteError(error),
          }) ?? null
        );
      } finally {
        setBusyKey(null);
      }
    },
    [address, writeContractAsync, queryClient, progress],
  );

  /** Resume or retry a stored record from wherever it stopped. */
  const resumeUnwrap = useCallback(
    async (record: UnwrapRequest): Promise<UnwrapRequest | null> => {
      setBusyKey(record.key);
      try {
        return await progress(record);
      } catch (error) {
        return (
          patchUnwrap(record.key, {
            status: "failed",
            error: humanizeWriteError(error),
          }) ?? null
        );
      } finally {
        setBusyKey(null);
      }
    },
    [progress],
  );

  return { startUnwrap, resumeUnwrap, busyKey };
}
