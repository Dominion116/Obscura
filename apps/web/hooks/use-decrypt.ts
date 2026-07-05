"use client";

// User decryption of confidential balances (PRD §8.4). Deliberately distinct
// from the public decryption used during unwrap finalization: the user signs
// an EIP-712 request binding a fresh, throwaway keypair, and the relayer
// re-encrypts the value to that keypair so the cleartext exists only in this
// browser session. Nothing decrypted here is ever persisted.

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useSignTypedData } from "wagmi";
import { wrapperAbi, type Address, type Hex } from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { getFhevmInstance } from "@/lib/fhevm";
import { humanizeWriteError } from "@/lib/errors";

/** An all-zero handle means the account has never held this wrapper. */
export const ZERO_HANDLE: Hex = `0x${"0".repeat(64)}`;

/** Ciphertext handle of the connected account's balance on a wrapper. */
export function useConfidentialBalanceHandle(wrapper: Address) {
  const { address } = useAccount();
  return useQuery({
    queryKey: ["confidential-balance", wrapper, address],
    enabled: Boolean(address),
    refetchInterval: 30_000,
    queryFn: () =>
      publicClient.readContract({
        address: wrapper,
        abi: wrapperAbi,
        functionName: "confidentialBalanceOf",
        args: [address as Address],
      }),
  });
}

// Matches KmsUserDecryptEIP712TypesType from the relayer SDK (minus the
// EIP712Domain entry, which viem derives from the domain object itself).
const USER_DECRYPT_TYPES = {
  UserDecryptRequestVerification: [
    { name: "publicKey", type: "bytes" },
    { name: "contractAddresses", type: "address[]" },
    { name: "startTimestamp", type: "uint256" },
    { name: "durationDays", type: "uint256" },
    { name: "extraData", type: "bytes" },
  ],
} as const;

export type DecryptStep = "idle" | "signing" | "decrypting";

export function useDecryptBalance(wrapper: Address) {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [step, setStep] = useState<DecryptStep>("idle");
  const [error, setError] = useState<string | null>(null);
  /** Cleartext balance in wrapper base units; session-only, never stored. */
  const [decrypted, setDecrypted] = useState<bigint | null>(null);

  const hide = useCallback(() => {
    setDecrypted(null);
    setError(null);
  }, []);

  const decrypt = useCallback(
    async (handle: Hex) => {
      if (!address) return;
      setError(null);
      try {
        const instance = await getFhevmInstance();
        const keypair = instance.generateKeypair();
        const startTimestamp = Math.floor(Date.now() / 1000);
        const durationDays = 1; // short-lived grant: one decryption session
        const eip712 = instance.createEIP712(
          keypair.publicKey,
          [wrapper],
          startTimestamp,
          durationDays,
        );

        setStep("signing");
        const signature = await signTypedDataAsync({
          domain: {
            name: eip712.domain.name,
            version: eip712.domain.version,
            chainId: Number(eip712.domain.chainId),
            verifyingContract: eip712.domain.verifyingContract,
          },
          types: USER_DECRYPT_TYPES,
          primaryType: "UserDecryptRequestVerification",
          message: {
            publicKey: eip712.message.publicKey as Hex,
            contractAddresses: [...eip712.message.contractAddresses] as Hex[],
            startTimestamp: BigInt(eip712.message.startTimestamp),
            durationDays: BigInt(eip712.message.durationDays),
            extraData: eip712.message.extraData as Hex,
          },
        });

        setStep("decrypting");
        const results = await instance.userDecrypt(
          [{ handle, contractAddress: wrapper }],
          keypair.privateKey,
          keypair.publicKey,
          signature.replace(/^0x/, ""),
          [wrapper],
          address,
          startTimestamp,
          durationDays,
        );
        const key = Object.keys(results).find(
          (k) => k.toLowerCase() === handle.toLowerCase(),
        );
        const value = key ? results[key as Hex] : undefined;
        if (typeof value !== "bigint") {
          throw new Error("The relayer response did not include the balance.");
        }
        setDecrypted(value);
      } catch (err) {
        setError(humanizeWriteError(err));
      } finally {
        setStep("idle");
      }
    },
    [address, wrapper, signTypedDataAsync],
  );

  return { decrypt, hide, step, error, decrypted };
}
