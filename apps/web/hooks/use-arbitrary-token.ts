"use client";

// Arbitrary ERC-7984 lookup: user decryption must work for any confidential
// token the wallet holds, not only registry pairs, so this probe accepts a
// pasted address. A successful confidentialBalanceOf read is what qualifies
// the address as an ERC-7984 token; metadata reads degrade to placeholders
// the same way the registry enrichment does.

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { wrapperAbi, type Address, type Hex } from "@obscura/shared";
import { publicClient } from "@/lib/viem";
import { shortAddress } from "@/lib/format";

export interface ArbitraryToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  /** Ciphertext handle of the connected account's balance. */
  handle: Hex;
}

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

/**
 * Probe any address as an ERC-7984 token and read the connected account's
 * balance handle from it. Not retried: a revert here almost always means
 * the address is not an ERC-7984 token, and the user should correct it.
 */
export function useArbitraryErc7984(token: Address | null) {
  const { address: account } = useAccount();
  return useQuery({
    queryKey: ["arbitrary-erc7984", token, account],
    enabled: Boolean(token) && Boolean(account),
    retry: false,
    queryFn: async (): Promise<ArbitraryToken> => {
      const contract = { address: token!, abi: wrapperAbi } as const;
      const [handle, symbol, name, decimals] = await Promise.allSettled([
        publicClient.readContract({
          ...contract,
          functionName: "confidentialBalanceOf",
          args: [account!],
        }),
        publicClient.readContract({ ...contract, functionName: "symbol" }),
        publicClient.readContract({ ...contract, functionName: "name" }),
        publicClient.readContract({ ...contract, functionName: "decimals" }),
      ]);
      if (handle.status === "rejected") {
        throw new Error(
          "This address did not answer confidentialBalanceOf, so it does not look like an ERC-7984 token on Sepolia.",
        );
      }
      return {
        address: token!,
        symbol: settled(symbol, shortAddress(token!)),
        name: settled(name, "Unknown token"),
        decimals: settled(decimals, 6),
        handle: handle.value,
      };
    },
  });
}
