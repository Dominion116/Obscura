"use client";

// Wrap flow (PRD §7.3): approve then wrap, run as one explicit sequence so a
// single click carries the user through both wallet prompts. The allowance
// is checked (not assumed) at the start of every run, so a retry after a
// failed wrap never re-prompts for an approval that is already in place.
// Approval covers the rounded amount only, since that is all the wrapper pulls.

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import {
  erc20Abi,
  wrapperAbi,
  SEPOLIA_CHAIN_ID,
  type Address,
  type EnrichedPair,
  type Hex,
} from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { humanizeWriteError } from "@/lib/errors";

export type WrapStep = "idle" | "approving" | "wrapping" | "success";

/** Live underlying-token balance of the connected account. */
export function useUnderlyingBalance(tokenAddress: Address) {
  const { address } = useAccount();
  return useQuery({
    queryKey: ["erc20-balance", tokenAddress, address],
    enabled: Boolean(address),
    refetchInterval: 30_000,
    queryFn: () =>
      publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as Address],
      }),
  });
}

export function useWrapFlow(pair: EnrichedPair) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<WrapStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<Hex | null>(null);

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setTxHash(null);
  }, []);

  /**
   * Run the full flow for `amount` underlying base units. The wrapper
   * contract itself rounds `amount` down to a multiple of rate and only
   * pulls `roundedAmount`, which is why the approval uses the latter.
   * Returns the wrap tx hash, or null when any step failed (the failure is
   * exposed through `error` for inline display).
   */
  const wrap = useCallback(
    async (amount: bigint, roundedAmount: bigint): Promise<Hex | null> => {
      if (!address) return null;
      setError(null);
      try {
        const allowance = await publicClient.readContract({
          address: pair.tokenAddress,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, pair.confidentialTokenAddress],
        });

        if (allowance < roundedAmount) {
          setStep("approving");
          const approveHash = await writeContractAsync({
            chainId: SEPOLIA_CHAIN_ID,
            address: pair.tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [pair.confidentialTokenAddress, roundedAmount],
          });
          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });
          if (approveReceipt.status !== "success") {
            throw new Error("The approval transaction reverted.");
          }
        }

        setStep("wrapping");
        const hash = await writeContractAsync({
          chainId: SEPOLIA_CHAIN_ID,
          address: pair.confidentialTokenAddress,
          abi: wrapperAbi,
          functionName: "wrap",
          args: [address, amount],
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status !== "success") {
          throw new Error("The wrap transaction reverted.");
        }

        setTxHash(hash);
        setStep("success");
        // The underlying balance moved, the confidential balance grew, and
        // the wrapper's TVS changed.
        void queryClient.invalidateQueries({ queryKey: ["erc20-balance"] });
        void queryClient.invalidateQueries({ queryKey: ["confidential-balance"] });
        void queryClient.invalidateQueries({ queryKey: ["registry"] });
        return hash;
      } catch (err) {
        setStep("idle");
        setError(humanizeWriteError(err));
        return null;
      }
    },
    [address, pair, writeContractAsync, queryClient],
  );

  return { step, error, txHash, wrap, reset };
}
